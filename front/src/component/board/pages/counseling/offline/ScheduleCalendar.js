import React, { useState } from 'react';
import './css/ScheduleCalendar.css';
import '../../../component/common/css/Button.css';
import { useNavigate } from 'react-router-dom';
import useIsAdmin from '../../../hooks/useIsAdmin';
import ScheduleModal from './ScheduleModal';

const ScheduleCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const isAdmin = useIsAdmin();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 예시 데이터 - 실제로는 백엔드에서 받아와야 함
    const schedules = {
        2: [
            { time: "14:00 ~ 15:00", status: "available", counselor: "홍길동" },
            { time: "16:00 ~ 17:00", status: "reserved", counselor: "관리자" }
        ],
        3: [
            { time: "13:00 ~ 14:00", status: "available", counselor: "이순신" },
            { time: "16:00 ~ 17:00", status: "available", counselor: "이순신" }
        ],
        8: [
            { time: "16:00 ~ 17:00", status: "available", counselor: "홍길동" }
        ]
    };

    // 월 이동 함수
    const moveMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    // 달력 데이터 생성
    const generateCalendarData = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        const calendar = [];
        let week = [];

        // 첫 주 빈 칸 채우기
        for (let i = 0; i < firstDay; i++) {
            week.push(null);
        }

        // 날짜 채우기
        for (let day = 1; day <= lastDate; day++) {
            week.push(day);
            if (week.length === 7) {
                calendar.push(week);
                week = [];
            }
        }

        // 마지막 주 빈 칸 채우기
        if (week.length > 0) {
            while (week.length < 7) {
                week.push(null);
            }
            calendar.push(week);
        }

        return calendar;
    };



    // 예약 가능한 상담 시간 표시
    const renderSchedule = (day) => {
        if (!day || !schedules[day]) return null;

        return (
            <div className='schedule-container'>
                {schedules[day].map((schedule, index) =>
                    <div
                        key={index}
                        className={`schedule ${schedule.status}`}
                        onClick={(e) => {
                            e.stopPropagation();  // td의 클릭 이벤트 전파 방지
                            handleScheduleClick(day, schedule);
                        }}
                    >
                        {schedule.counselor}
                        {schedule.status === 'reserved' && ' - 예약됨'}
                        <div>
                            {schedule.time}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // 상담 일정 등록
    const handleScheduleCreate = () => {
        setIsModalOpen(true);
    };

    // 상담 일정 관리
    const handleManageSchedule = () => {
        navigate('/counsel/offline/schedule/manage');
    };

    // 상담 일정 클릭 처리
    const handleScheduleClick = (day, schedule) => {
        if (schedule.status === 'reserved') {
            // 예약된 상담은 작성자만 접근 가능
            // TODO: 작성자 확인 로직 추가
            alert('예약된 상담입니다.');
        } else {
            // 예약 페이지로 이동
            // TODO: 라우팅 처리
            console.log(`${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${day}일 예약하기`);
            navigate('/counsel/offline/register');
        }
    };

    return (
        <div className="schedule-calendar">
            <div className="calendar-header">
                <button onClick={() => moveMonth(-1)}>◀</button>
                <h3>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</h3>
                <button onClick={() => moveMonth(1)}>▶</button>
            </div>
            <table className="calendar">
                <thead>
                    <tr>
                        <th className="sun">SUN</th>
                        <th>MON</th>
                        <th>TUE</th>
                        <th>WED</th>
                        <th>THU</th>
                        <th>FRI</th>
                        <th className="sat">SAT</th>
                    </tr>
                </thead>
                <tbody>
                    {generateCalendarData().map((week, i) => (
                        <tr key={i}>
                            {week.map((day, j) => (
                                <td key={j}>
                                    <div className='cell-content'>
                                        {day && <div className="cal-day">{day}</div>}
                                        <div className='schedule-container'>
                                            {renderSchedule(day)}
                                        </div>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {isAdmin && (
                <div className="buttonContainer">
                    <button onClick={handleScheduleCreate}>
                        일정 등록
                    </button>
                    <button onClick={handleManageSchedule}>
                        일정 관리
                    </button>
                </div>
            )}

            {/* 일정 등록 모달 */}
            <ScheduleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default ScheduleCalendar;
