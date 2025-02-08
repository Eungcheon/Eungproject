import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSocket, disconnectSocket } from '../../../hooks/socket'; // 전역 소켓 관리
import UserRequestHandler from './UserRequestHandler';
import './css/ChatRoom.css';

const ChatRoom = () => {
    const { roomId } = useParams(); // URL에서 roomId 가져오기
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    // 초기화 시에만 로컬 스토리지에서 userName을 가져옴
    const initialUserName = JSON.parse(localStorage.getItem('userInfo'))?.userName || 'Guest';
    const [userName] = useState(initialUserName); // 이후 변경되지 않도록 고정

    const navigate = useNavigate();

    const socketRef = useRef(null);

    useEffect(() => {
        const socket = getSocket();
        socketRef.current = socket;


        // 메시지 수신 이벤트
        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // 시스템 메시지 수신
        socket.on('systemMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, { sender: 'System', message }]);
        });

        // 에러 처리
        socket.on('error', (error) => {
            console.error('Error:', error.message);
        });

        // 컴포넌트 언마운트 시 소켓 및 리스너 정리
        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leaveRoom', { roomId });
                socketRef.current.off('receiveMessage');
                disconnectSocket();
            }
        };
    }, [roomId, userName]);

    useEffect(() => {
        // 방 종료 시 처리
        socketRef.current.on('roomEnded', () => {
            alert('상담이 종료되었습니다. 메인 페이지로 이동합니다.');
            // 상담사의 경우 대시보드로, 사용자는 "/counsel"로 리다이렉트
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (userInfo.userRole === 'ADMIN') {
                navigate('/counsel/realtime/dashboard');
            } else {
                navigate('/counsel');
            }
        });

        return () => {
            socketRef.current.off('roomEnded');
        };
    }, [navigate]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            const messageData = { roomId, sender: userName, message: inputMessage };
            socketRef.current.emit('sendMessage', messageData);
            setInputMessage('');
        }
    };

    const handleEndRoom = () => {
        if (window.confirm('정말로 상담을 종료하시겠습니까?')) {
            // 서버에 방 종료 요청
            socketRef.current.emit('endRoom', { roomId });
        }
    };

    return (
        <div className="chat-room">
            <UserRequestHandler />
            <h1>채팅방: {roomId}</h1>
            {/* 채팅창 */}
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong>{msg.sender}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            {/* 채팅 입력/전송 */}
            <form className="message-form" onSubmit={sendMessage}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="메시지를 입력하세요"
                />
                <button type="submit">전송</button>
            </form>
            {/* 방 종료 버튼 */}
            <button className="end-room-button" onClick={handleEndRoom}>
                상담 종료
            </button>
        </div>
    );
};

export default ChatRoom;
