import React, { useState } from "react";
import ScheduleCalendar from "./ScheduleCalendar";
import CounselStatistics from "./CounselStatistics";
import './css/OfflineCounsel.css';

const OfflineCounsel = () => {
    const [activeTab, setActiveTab] = useState('schedule');

    return (
        <div className="offline-counsel-main">
            <h1>오프라인 상담</h1>
            <p>예약에 대한 설명</p>
            <div className="tab-container">
                <button
                    className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
                    onClick={() => setActiveTab('schedule')}
                >
                    일정/예약
                </button>
                <button
                    className={`tab-button ${activeTab === 'statistics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('statistics')}
                >
                    상담통계
                </button>
            </div>

            <div className="content-container">
                {activeTab === 'schedule' ? (
                    <ScheduleCalendar />
                ) : (
                    <CounselStatistics />
                )}
            </div>
        </div>
    );
};

export default OfflineCounsel;