const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const rooms = new Map();

io.on('connection', (socket) => {
    console.log('사용자 연결됨');

    socket.on('joinRoom', ({ counselorId }) => {
        socket.join(counselorId);
        rooms.set(socket.id, counselorId);
    });

    socket.on('sendMessage', ({ counselorId, message }) => {
        io.to(counselorId).emit('receiveMessage', {
            content: message,
            sender: socket.id,
            type: 'user'
        });
    });

    socket.on('endCounseling', () => {
        const roomId = rooms.get(socket.id);
        if (roomId) {
            io.to(roomId).emit('counselingEnded');
            rooms.delete(socket.id);
        }
    });

    socket.on('disconnect', () => {
        rooms.delete(socket.id);
        console.log('사용자 연결 해제');
    });
});

const PORT = process.env.PORT || 8090;
server.listen(PORT, () => {
    console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});
