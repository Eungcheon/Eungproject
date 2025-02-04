import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import './css/ChatRoom.css';

const ChatRoom = () => {
    const { roomId } = useParams(); // URL에서 roomId 가져오기
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const socketRef = useRef(io('http://localhost:8095'));

    useEffect(() => {
        socketRef.current.emit('joinRoom', { roomId }); // 방 연결

        socketRef.current.on('receiveMessage', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [roomId]);

    const sendMessage = (e) => {
        e.preventDefault();
        socketRef.current.emit('sendMessage', {
            roomId,
            sender: '유저',
            message: inputMessage,
        });
        setInputMessage('');
    };

    return (
        <div className="chat-room">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        {msg.sender}: {msg.message}
                    </div>
                ))}
            </div>
            <form className="message-form" onSubmit={sendMessage}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <button type="submit">전송</button>
            </form>
        </div>
    );
};

export default ChatRoom;
