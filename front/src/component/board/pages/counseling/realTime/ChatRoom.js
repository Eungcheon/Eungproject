import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './ChatRoom.css';

const ChatRoom = () => {
    const { counselorId } = useParams();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [status, setStatus] = useState('connecting');
    const socketRef = useRef();
    const navigate = useNavigate();
    
    useEffect(() => {
        socketRef.current = io('http://localhost:8090');

        socketRef.current.emit('joinRoom', { counselorId });

        socketRef.current.on('connect', () => {
            setStatus('chatting');
        });

        socketRef.current.on('receiveMessage', (message) => {
            setMessages(prev => [...prev, message]);
        });

        socketRef.current.on('counselingEnded', () => {
            alert('상담이 종료되었습니다.');
            navigate('/counsel');
        });

        return () => socketRef.current.disconnect();
    }, [counselorId]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            socketRef.current.emit('sendMessage', {
                counselorId,
                message: inputMessage
            });
            setInputMessage('');
        }
    };

    return (
        <div className="chat-room">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.type}`}>
                        <span className="sender">{msg.sender}</span>
                        <p>{msg.content}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="message-form">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                />
                <button type="submit">전송</button>
            </form>
        </div>
    );
};

export default ChatRoom;
