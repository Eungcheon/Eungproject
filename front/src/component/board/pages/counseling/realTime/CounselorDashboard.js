import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../../../hooks/socket'; // 전역 소켓 가져오기
import './css/CounselorDashboard.css';

const CounselorDashboard = () => {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const handleCounselRequest = ({ userId, userName, roomId }) => {
            setRequests((prev) => [...prev, { userId, userName, roomId }]);
        };

        // 상담 요청 수신 이벤트 등록
        socket.on('counselRequest', handleCounselRequest);

        return () => {
            socket.off('counselRequest', handleCounselRequest); // 기존 리스너 제거
        };
    }, []);

    const handleAccept = (roomId) => {
        socket.emit('acceptCounseling', { roomId }); // 상담 수락 이벤트 전송
        navigate(`/counsel/realtime/chat/${roomId}`); // 방으로 이동
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
