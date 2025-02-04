const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { v4: uuidv4 } = require('uuid'); // 고유 방 ID 생성용

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*', // 개발 환경용, 모든 출처 허용
        methods: ['GET', 'POST'],
    },
});

// 상담 대기열 관리
let pendingRequests = []; // { userId, userName, socketId, roomId, status: 'pending' }

io.on('connection', (socket) => {
    console.log('새로운 사용자 연결:', socket.id);

    // 유저가 상담 요청
    socket.on('requestCounseling', ({ userId, userName }) => {
        const roomId = uuidv4(); // 고유 방 ID 생성
        console.log(`상담 요청: ${userName}, Room ID: ${roomId}`);
        pendingRequests.push({ userId, userName, socketId: socket.id, roomId, status: 'pending' });

        // 상담사들에게 실시간 알림
        io.emit('counselRequest', { userId, userName, roomId });
    });

    // 상담사가 요청 수락
    socket.on('acceptCounseling', ({ userSocketId, roomId, counselorId, counselorName }) => {
        console.log(`상담 수락: ${counselorName}, Room ID: ${roomId}`);

        // 상담사가 방에 입장
        socket.join(roomId);
        io.to(userSocketId).emit('counselAccepted', { roomId, counselorName }); // 유저에게 상담 시작 알림

        // 대기열에서 해당 요청 제거
        pendingRequests = pendingRequests.filter((req) => req.socketId !== userSocketId);
    });

    // 채팅 메시지 처리
    socket.on('sendMessage', ({ roomId, sender, message }) => {
        io.to(roomId).emit('receiveMessage', { sender, message });
    });

    // 상담 종료
    socket.on('endCounseling', ({ roomId }) => {
        console.log(`상담 종료: ${roomId}`);
        io.to(roomId).emit('counselingEnded');
        io.socketsLeave(roomId); // 연결 종료
    });

    socket.on('disconnect', () => {
        console.log('사용자 연결 종료:', socket.id);
    });
});

server.listen(8095, () => {
    console.log('Socket.IO 서버가 8095 포트에서 실행 중입니다.');
});
