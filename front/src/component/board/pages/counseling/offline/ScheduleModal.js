import React, { useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import { SERVER_URL } from '../../../api/serverURL';
import axios from 'axios';
import { ko } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import './css/ScheduleModal.css';
import { addMonths } from 'date-fns';

const ScheduleModal = ({ isOpen, onClose }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const timeSlots = [
        "09:00~10:00", "10:00~11:00", "11:00~12:00",
        "13:00~14:00", "14:00~15:00", "15:00~16:00",
        "16:00~17:00", "17:00~18:00"
    ];

    const handleSubmit = async () => {
        try {
            // API 호출
            await axios.post(`${SERVER_URL}/api/counsel/schedule`, {
                counselor: userInfo.userName,
                date: selectedDate,
                time: selectedTime
            });
            onClose();
            // 성공 메시지
            alert('일정이 등록되었습니다.');
        } catch (error) {
            console.error('Error:', error);
            alert('일정 등록에 실패했습니다.');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="schedule-modal"
            overlayClassName="schedule-modal-overlay"
        >
            <h2>상담 일정 등록</h2>
            <div className="modal-content">
                <div className="input-group">
                    <label>상담사</label>
                    <input 
                        type="text" 
                        value={userInfo?.userName || ''} 
                        disabled 
                    />
                </div>

                <div className="input-group">
                    <label>날짜 선택</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="yyyy-MM-dd"
                        locale={ko}
                        minDate={new Date()}
                        maxDate={addMonths(new Date(), 4)}  // 4개월까지 가능
                        className="date-picker"
                    />
                </div>

                <div className="input-group">
                    <label>시간 선택</label>
                    <select 
                        value={selectedTime} 
                        onChange={(e) => setSelectedTime(e.target.value)}
                    >
                        <option value="">시간을 선택하세요</option>
                        {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>

                <div className="button-group">
                    <button 
                        className="submit-button" 
                        onClick={handleSubmit}
                        disabled={!selectedTime}
                    >
                        등록
                    </button>
                    <button 
                        className="cancel-button" 
                        onClick={onClose}
                    >
                        취소
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ScheduleModal;
