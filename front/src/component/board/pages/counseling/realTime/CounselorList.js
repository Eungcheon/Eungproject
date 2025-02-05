import React from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../../../hooks/socket'; // 전역 소켓 가져오기
import './css/CounselorList.css';

const counselorData = [
    { id: 1, name: '김상담', status: 'available', info: '심리상담 전문가', experience: '10년' },
    { id: 2, name: '이상담', status: 'busy', info: '청소년 상담 전문', experience: '7년' },
    { id: 3, name: '박상담', status: 'available', info: '대학생활 상담 전문', experience: '5년' },
];

const CounselorList = () => {
    const navigate = useNavigate();

    const handleChatStart = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const roomId = `${userInfo.userId}-${Date.now()}`; // 고유 Room ID 생성

        // 상담 요청 전송
        socket.emit('requestCounseling', {
            userId: userInfo.userId,
            userName: userInfo.userName,
            roomId,
        });

        // 사용자 바로 방으로 이동
        navigate(`/counsel/realtime/chat/${roomId}`);
        socket.emit('joinRoom', { roomId });
    };

    return (
        <div className="counselor-list-container">
            <h2>실시간 상담</h2>
            <div className="counselor-grid">
                {counselorData.map((counselor) => (
                    <div key={counselor.id} className="counselor-card">
                        <h3>{counselor.name}</h3>
                        <p className="info">{counselor.info}</p>
                        <p className="experience">경력: {counselor.experience}</p>
                        <div className={`status ${counselor.status}`}>
                            {counselor.status === 'available' ? '상담 가능' : '상담중'}
                        </div>
                        <button
                            onClick={handleChatStart}
                            disabled={counselor.status !== 'available'}
                        >
                            상담 시작
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CounselorList;
