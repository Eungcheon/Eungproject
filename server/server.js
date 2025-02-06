const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*', // 개발 환경용, 모든 출처 허용
        methods: ['GET', 'POST'],
    },
});

// 상담 대기열 및 활성화된 방 관리
let pendingRequests = []; // 대기 중인 요청 목록
const activeRooms = {}; // 활성화된 방 { roomId: { userId, userName, counselorId } }

io.on('connection', (socket) => {
    console.log('새로운 사용자 연결:', socket.id);

    // 상담 요청 처리
    socket.on('requestCounseling', ({ userId, userName }, callback) => {
        if (!userId || !userName) {
            console.error('상담 요청 실패: 필수 데이터 누락');
            callback({ error: '유효하지 않은 요청 데이터입니다.' });
            return;
        }

        const roomId = `${userId}-${Date.now()}`; // 고유 Room ID 생성
        console.log(`상담 요청: ${userName}, Room ID: ${roomId}`);

        // 대기 중인 요청 추가
        pendingRequests.push({
            userId,
            userName,
            socketId: socket.id,
            roomId,
            status: 'pending',
        });

        // 사용자를 생성된 Room에 입장시킴
        socket.join(roomId);

        // 생성된 Room ID를 클라이언트로 반환
        callback({ roomId });

        // 상담사들에게 대기 중인 요청 알림
        io.emit('counselRequest', { userId, userName, roomId });

        console.log(`사용자 ${userName} (${socket.id})가 방 ${roomId}에 입장`);
    });


    // 상담사가 상담 요청 수락
    socket.on('acceptCounseling', ({ roomId, counselorId }) => {
        // 대기 중인 요청 검증
        const requestIndex = pendingRequests.findIndex((req) => req.roomId === roomId);
        if (requestIndex === -1) {
            console.error('상담 요청 수락 실패: 유효하지 않은 Room ID');
            socket.emit('error', { message: '유효하지 않은 상담 요청입니다.' });
            return;
        }

        const request = pendingRequests[requestIndex];

        // 방 활성화
        activeRooms[roomId] = {
            userId: request.userId,
            userName: request.userName,
            counselorId,
        };
        pendingRequests.splice(requestIndex, 1); // 대기열에서 요청 제거
        console.log(`상담 요청 수락: Room ID: ${roomId}`);

        console.log('현재 활성화된 방:', activeRooms);

        // 방 입장 처리
        socket.join(roomId);
        io.to(roomId).emit('systemMessage', `상담사가 입장했습니다.`);
    });


    // 사용자 또는 상담사 방 참여
    socket.on('joinRoom', ({ roomId, userName }) => {
        if (!activeRooms[roomId]) {
            socket.emit('error', { message: 'Room ID가 유효하지 않습니다.' });
            return;
        }

        socket.join(roomId);
        socket.data.userName = userName; // 소켓에 사용자 이름 저장
    });

    // 메시지 처리
    socket.on('sendMessage', ({ roomId, sender, message }) => {
        if (!activeRooms[roomId]) {
            // 방이 아직 활성화되지 않은 경우, 사용자에게 알림 전송
            socket.emit('systemMessage', { message: '상담사가 아직 참여하지 않았습니다.' });
            console.warn(`[WARN] Room ID ${roomId}는 아직 활성화되지 않았습니다.`);
            return;
        }

        io.to(roomId).emit('receiveMessage', { sender, message });
    });

    // 방 떠나기
    socket.on('leaveRoom', ({ roomId }) => {
        if (!roomId) return;

        socket.leave(roomId);
        console.log(`사용자가 방 ${roomId}에서 나감`);
    });

    socket.on('endRoom', ({ roomId }) => {
        console.log(`Room 종료 요청: ${roomId}`);
    
        // 방이 활성화되어 있는지 확인
        if (!activeRooms[roomId]) {
            console.error(`Room ID ${roomId}는 활성화되지 않았습니다.`);
            socket.emit('error', { message: '유효하지 않은 Room ID입니다.' });
            return;
        }
    
        // 방에 연결된 모든 사용자에게 종료 이벤트 알림
        io.to(roomId).emit('roomEnded');
    
        // 방에서 모든 소켓을 분리
        const roomSockets = io.sockets.adapter.rooms.get(roomId);
        if (roomSockets) {
            roomSockets.forEach((socketId) => {
                const clientSocket = io.sockets.sockets.get(socketId);
                clientSocket.leave(roomId); // 해당 소켓을 방에서 나가게 함
            });
        }
    
        // 활성화된 방에서 데이터 삭제
        delete activeRooms[roomId];
        console.log(`Room ID ${roomId} 데이터가 삭제되었습니다.`);
    });

    // 사용자 연결 종료 처리
    socket.on('disconnect', () => {
        console.log('사용자 연결 종료:', socket.id);

        // 대기열 요청 제거
        pendingRequests = pendingRequests.filter((req) => req.socketId !== socket.id);
    });
});

server.listen(8095, () => {
    console.log('Socket.IO 서버가 8095 포트에서 실행 중입니다.');
});
