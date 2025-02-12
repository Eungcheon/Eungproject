import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../../../hooks/socket'; // 전역 소켓 관리 방식
import './css/CounselorList.css';
import { LoginContext } from '../../../../login/security/contexts/LoginContextProvider';

const counselorData = [
    { id: 1, name: '김상담', status: 'available', info: '심리상담 전문가', experience: '10년' },
    { id: 2, name: '이상담', status: 'busy', info: '청소년 상담 전문', experience: '7년' },
    { id: 3, name: '박상담', status: 'available', info: '대학생활 상담 전문', experience: '5년' },
];

const CounselorList = () => {
    const navigate = useNavigate();
    const { isName, isUserId } = useContext(LoginContext);

    const handleChatStart = async () => {
        const socket = getSocket(); // 소켓 초기화

        // 상담 요청 전송 및 roomId 수신
        socket.emit(
            'requestCounseling',
            {
                userId: isUserId,
                userName: isName,
            },
            ({ roomId, error }) => {
                if (error) {
                    console.error('방 생성 실패:', error);
                    return;
                }

                // 서버에서 roomId를 받아온 경우
                console.log('생성된 Room ID:', roomId);

                // 사용자 바로 방으로 이동
                navigate(`/counsel/realtime/chat/${roomId}`);

                // 방에 참여
                socket.emit('joinRoom', { roomId, userName: isName });
            }
        );
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
            <button onClick={() => navigate("/counsel/realtime/dashboard")}>
                대시보드    
            </button>
        </div>
    );
};

export default CounselorList;
