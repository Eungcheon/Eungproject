import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../api/serverURL";
import './css/ScheduleManage.css';

const ScheduleManage = () => {
    const [schedules, setSchedules] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/api/counsel/schedule`);
            setSchedules(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    const handleDelete = async (scheduleId) => {
        if (window.confirm('이 일정을 삭제하시겠습니까?')) {
            try {
                await axios.delete(`${SERVER_URL}/api/counsel/schedule/${scheduleId}`);
                fetchSchedules();
            } catch (error) {
                console.error('Error deleting schedule:', error);
            }
        }
    };

    return (
        <div className="schedule-manage">
            <h2>상담 일정 관리</h2>
            <table>
                <thead>
                    <tr>
                        <th>날짜</th>
                        <th>시간</th>
                        <th>예약 상태</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map(schedule => (
                        <tr key={schedule.id}>
                            <td>{schedule.date}</td>
                            <td>{schedule.time}</td>
                            <td data-status={schedule.status}>
                                {schedule.status === 'available' ? '예약 가능' : '예약됨'}
                            </td>
                            <td>
                                {schedule.status === 'available' && (
                                    <button onClick={() => handleDelete(schedule.id)}>
                                        삭제
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScheduleManage;