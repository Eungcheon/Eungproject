import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './css/CounselorDashboard.css';

const CounselorDashboard = () => {
    const [requests, setRequests] = useState([]);
    const socketRef = useRef(io('http://localhost:8095'));
    const navigate = useNavigate();

    useEffect(() => {
        // 상담 요청 수신
        socketRef.current.on('counselRequest', ({ userId, userName, roomId }) => {
            setRequests((prev) => [...prev, { userId, userName, roomId }]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const handleAccept = (roomId) => {
        // 상담사 요청 수락
        socketRef.current.emit('acceptCounseling', {
            roomId,
            counselorId: '1234', // 상담사 ID
            counselorName: '상담사1',
        });

        // 방으로 이동
        navigate(`/counsel/realtime/chat/${roomId}`);
    };

    return (
        <div className="counselor-dashboard-container">
            <h1>상담 요청 목록</h1>
            <div className="request-list">
                {requests.length > 0 ? (
                    requests.map((request) => (
                        <div key={request.roomId} className="request-card">
                            <h3>{request.userName}님의 요청</h3>
                            <button
                                className="accept-button"
                                onClick={() => handleAccept(request.roomId)}
                            >
                                수락
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="no-requests">현재 대기 중인 상담 요청이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default CounselorDashboard;
