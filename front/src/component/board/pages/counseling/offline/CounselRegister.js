import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SERVER_URL } from '../../../api/serverURL';
import './css/CounselRegister.css';
import '../../common/css/Button.css';

const CounselRegister = () => {
    const navigate = useNavigate();
    const [counselData, setCounselData] = useState({
        counselor: '김OO',  // 예약된 상담사
        client: '이OO',        // 신청자 이름
        date: '2024.03.05 16:00', // 선택된 예약 시간
        content: ''        // 상담 내용
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCounselData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            await axios.post(`${SERVER_URL}/api/counsel/offline`, counselData);
            alert('상담이 신청되었습니다.');
            navigate('/counsel/offline');
        } catch (error) {
            console.error('Error registering counsel:', error);
            alert('상담 신청에 실패했습니다.');
        }
    };

    return (
        <div className="offline-counsel-register">
            <h2>오프라인 상담 신청</h2>
            <table className="offline-counsel-table">
                <tbody>
                    <tr>
                        <th>상담사</th>
                        <td>{counselData.counselor}</td>
                    </tr>
                    <tr>
                        <th>예약자</th>
                        <td>{counselData.client}</td>
                    </tr>
                    <tr>
                        <th>예약일자</th>
                        <td>{counselData.date}</td>
                    </tr>
                    <tr>
                        <th>상담 내용</th>
                        <td>
                            <textarea
                                name="content"
                                value={counselData.content}
                                onChange={handleChange}
                                placeholder="상담하고 싶은 내용을 간단하게 적어주세요."
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="common-button-container">
                <button onClick={handleSubmit}>저장</button>
                <button onClick={() => navigate('/counsel/offline')}>목록</button>
            </div>
        </div>
    );
};

export default CounselRegister;
