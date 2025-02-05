import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import './css/ChatRoom.css';

const ChatRoom = () => {
    const { roomId } = useParams(); // URL에서 roomId 가져오기
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const socketRef = useRef(null); // 소켓 인스턴스를 저장

    useEffect(() => {
        // 소켓이 초기화되지 않았다면 초기화
        if (!socketRef.current) {
            socketRef.current = io('http://localhost:8095'); // 소켓 연결
        }

        // 방에 입장
        socketRef.current.emit('joinRoom', { roomId });

        // 메시지 수신 이벤트 핸들러
        const handleReceiveMessage = (message) => {
            setMessages((prevMessages) => [...prevMessages, message]); // 이전 메시지에 새 메시지를 추가
        };

        // 메시지 수신 이벤트 등록
        socketRef.current.on('receiveMessage', handleReceiveMessage);

        // 컴포넌트 언마운트 시 소켓 연결 해제 및 이벤트 제거
        return () => {
            if (socketRef.current) {
                socketRef.current.off('receiveMessage', handleReceiveMessage); // 기존 이벤트 제거
                socketRef.current.disconnect(); // 소켓 연결 해제
                socketRef.current = null; // 소켓 참조 초기화
            }
        };
    }, [roomId]); // roomId가 변경될 때만 실행

    const sendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            socketRef.current.emit('sendMessage', {
                roomId,
                sender: '유저',
                message: inputMessage,
            });
            setInputMessage(''); // 입력창 초기화
        }
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
