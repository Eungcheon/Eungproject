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

const counselorStatuses = {};

io.on('connection', (socket) => {
    console.log('새로운 사용자 연결:', socket.id);
    const { counselorId } = socket.handshake.query; // 소켓 연결 시 counselorId 받기

    if (counselorId) {
        counselorStatuses[counselorId] = 'available'; // 상태를 대기 중으로 설정
        console.log(`상담사 ${counselorId} 상태: 대기 중`);
        io.emit('counselorStatusUpdate', counselorStatuses); // 클라이언트에 상태 전송
    }

    // 상담사가 채팅을 시작했을 때
    socket.on('startChat', () => {
        if (counselorId) {
            counselorStatuses[counselorId] = 'busy'; // 상태를 상담 중으로 변경
            io.emit('counselorStatusUpdate', counselorStatuses); // 상태 업데이트
        }
    });
    // 상담 요청 처리
    socket.on('requestCounseling', ({ userId, userName, counselorName }, callback) => {
        if (!userId || !userName || !counselorName) {
            console.error('상담 요청 실패: 필수 데이터 누락');
            callback({ error: '유효하지 않은 요청 데이터입니다.' });
            return;
        }

        const roomId = `${userId}-${Date.now()}`; // 고유 Room ID 생성
        console.log(`상담 요청: ${userName}, Room ID: ${roomId}, Counselor: ${counselorName}`);

        // 대기 중인 요청 추가
        pendingRequests.push({
            userId,
            userName,
            counselorName,
            socketId: socket.id,
            roomId,
            status: 'pending',
        });

        // 사용자를 생성된 Room에 입장시킴
        socket.join(roomId);

        // 생성된 Room ID를 클라이언트로 반환
        callback({ roomId });

        // 상담사들에게 대기 중인 요청 알림
        io.emit('counselRequest', { userId, userName, roomId, counselorName });

        console.log(`사용자 ${userName} (${socket.id})가 방 ${roomId}에 입장`);
    });


    socket.on('acceptCounseling', ({ roomId, counselorId }) => {
        // 상담사가 이미 상담 중인지 확인
        const isCounselorBusy = Object.values(activeRooms).some(
            (room) => room.counselorId === counselorId
        );
        if (isCounselorBusy) {
            socket.emit('error', { message: '상담사가 이미 상담 중입니다.' });
            return;
        }
    
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
    
        // 상담사가 방에 참여하도록 추가
        socket.join(roomId);
        console.log(`상담 요청 수락: Room ID: ${roomId}, Counselor ID: ${counselorId}`);
        io.to(roomId).emit('systemMessage', `상담사가 입장했습니다.`);
    
        // 같은 상담사와 연결된 다른 대기 요청 취소
        pendingRequests = pendingRequests.filter((req) => {
            if (req.counselorId === counselorId && req.roomId !== roomId) {
                // 요청 취소 알림 전송
                io.to(req.socketId).emit('requestCanceled', {
                    message: '다른 요청이 수락되었습니다.',
                    roomId: req.roomId,
                });
    
                // 방에서 나가기 처리
                const clientSocket = io.sockets.sockets.get(req.socketId);
                if (clientSocket) {
                    clientSocket.leave(req.roomId); // 방 나가기
                    console.log(`사용자 ${req.userName}가 방 ${req.roomId}에서 나갔습니다.`);
                }
    
                return false; // 대기 요청 제거
            }
            return true;
        });
    
        // 수락된 요청 대기열에서 제거
        pendingRequests = pendingRequests.filter((req) => req.roomId !== roomId);
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

        if (counselorId) {
            counselorStatuses[counselorId] = 'offline'; // 상태를 오프라인으로 설정
            io.emit('counselorStatusUpdate', counselorStatuses); // 상태 업데이트
        }

        // 대기열 요청 제거
        pendingRequests = pendingRequests.filter((req) => req.socketId !== socket.id);
    });
});

server.listen(8095, () => {
    console.log('Socket.IO 서버가 8095 포트에서 실행 중입니다.');
});
