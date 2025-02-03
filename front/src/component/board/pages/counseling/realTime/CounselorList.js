import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CounselorList.css';

const CounselorList = () => {
    const [counselors, setCounselors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCounselors();
    }, []);

    const fetchCounselors = async () => {
        try {
            const response = await axios.get('/api/counselors');
            setCounselors(response.data);
        } catch (error) {
            console.error('Error fetching counselors:', error);
        }
    };

    const handleCounselorClick = (counselorId) => {
        navigate(`/chat/${counselorId}`);
    };

    return (
        <div className="counselor-list">
            {counselors.map(counselor => (
                <div 
                    key={counselor.id} 
                    className="counselor-card"
                    onClick={() => handleCounselorClick(counselor.id)}
                >
                    <h3>{counselor.name}</h3>
                    <p>{counselor.info}</p>
                    <span className={`status ${counselor.status}`}>
                        {counselor.status === 'available' ? '상담 가능' : '상담중'}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default CounselorList;
