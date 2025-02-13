import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket } from "../../../hooks/socket";
import { LoginContext } from "../../../../login/security/contexts/LoginContextProvider";
import "./css/CounselorList.css";

const CounselorList = () => {
    const navigate = useNavigate();
    const { isUserId, isName } = useContext(LoginContext); // 로그인 정보
    const [counselors, setCounselors] = useState([]); // 상담사 목록

    useEffect(() => {
        // 상담사 목록 가져오기 (예: API 호출)
        fetch("/api/counselors")
            .then((res) => res.json())
            .then((data) => setCounselors(data))
            .catch((err) => console.error("Error fetching counselors:", err));
    }, []);

    const handleChatStart = (counselorName) => {
        const socket = getSocket();

        // 상담 요청 전송
        socket.emit(
            "requestCounseling",
            { userId: isUserId, userName: isName, counselorName },
            ({ roomId, error }) => {
                if (error) {
                    console.error("상담 요청 실패:", error);
                    return;
                }

                navigate(`/counsel/realtime/chat/${roomId}`); // 채팅방으로 이동
            }
        );
    };

    return (
        <div className="counselor-list-container">
            <h2>실시간 상담사 목록</h2>
            <div className="counselor-grid">
                {counselors.map((counselor) => (
                    <div key={counselor.id} className="counselor-card">
                        <h3>{counselor.name}</h3>
                        <p className="info">{counselor.info}</p>
                        <p className="experience">경력: {counselor.experience}</p>
                        <button
                            className="chat-button"
                            onClick={() => handleChatStart(counselor.name)}
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
