import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../api/serverURL";
import './css/ScheduleManage.css';
import { LoginContext } from "../../../../login/security/contexts/LoginContextProvider";

const ScheduleManage = () => {
    const [schedules, setSchedules] = useState([]);
    const { isName } = useContext(LoginContext);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/api/counsel/schedule`,
                {
                    params: { counselor: isName } // 서버에 상담사 이름 전달
                }
            );
            setSchedules(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    const handleDelete = async (scheduleId) => {
        if (window.confirm('이 일정을 삭제하시겠습니까?')) {
            try {
                await axios.delete(`${SERVER_URL}/api/counsel/schedule/${scheduleId}`,
                    {
                        params: { counselor: isName } // 서버에 상담사 이름 전달
                    });
                fetchSchedules();
            } catch (error) {
                console.error('Error deleting schedule:', error);
            }
        }
    };

    return (
        <div className="offline-schedule-manage">
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
                            <td>{schedule.counsel_date}</td>
                            <td>{schedule.counsel_time}</td>
                            <td data-status={schedule.reserve_status}>
                                {!schedule.reserve_status ? '예약 대기중' : '예약됨'}
                            </td>
                            <td>
                                {!schedule.reserve_status && (
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