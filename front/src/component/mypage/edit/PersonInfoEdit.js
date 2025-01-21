import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Edit.css';
import Header from '../page/Header';
import Footer from '../page/Footer';
import Sidebar from '../page/Sidebar';

const PersonInfoEdit = () => {
    const [id, setId] = useState(''); // 아이디 상태
    const [name, setName] = useState(''); // 이름 상태
    const [email, setEmail] = useState(''); // 이메일 상태
    const [gender, setGender] = useState(''); // 성별 상태
    const [currentPassword, setCurrentPassword] = useState(''); // 기존 비밀번호 상태
    const [newPassword, setNewPassword] = useState(''); // 새로운 비밀번호 상태
    const [department, setDepartment] = useState(''); // 학과 상태
    const [phone, setPhone] = useState(''); // 전화번호 상태
    const userId = 1; // 예: 실제 사용자 ID는 로그인 상태에서 가져옴

    useEffect(() => {
        // 사용자 정보 초기 로드
        axios.get(`/api/users/${userId}`) // 사용자 정보를 가져오는 API 호출
            .then((response) => {
                const { id, name, email, gender, phone, department } = response.data;
                setId(id);
                setName(name);
                setEmail(email);
                setGender(gender);
                setPhone(phone);
                setDepartment(department);
            })
            .catch((error) => {
                console.error(error);
                alert('사용자 정보를 가져오는 데 실패했습니다.');
            });
    }, [userId]);

    // 폼 제출 핸들러
    const handleSubmit = async (event) => {
        event.preventDefault();

        // 전화번호 형식 검증
        const phoneRegex = /^(01[0-9]-\d{3,4}-\d{4}|01[0-9]\d{7,8})$/;
        if (!phoneRegex.test(phone)) {
            alert('전화번호 형식이 올바르지 않습니다. 다시 입력해주세요.');
            return;
        }

        // API 요청 데이터
        const userInfo = {
            name,
            email,
            phone,
            gender,
            department,
        };

        try {
            // 개인정보 수정 API 호출
            await axios.put(`/api/users/${userId}`, userInfo);
            alert('회원정보가 성공적으로 수정되었습니다.');
        } catch (error) {
            console.error(error);
            alert('회원정보 수정 중 오류가 발생했습니다.');
        }
    };

    return (
        <div>
            <Header />
            <div className="edit-container">
                <main className="edit-main">
                    <Sidebar />
                    <section className="edit-form-container">
                        <h2>개인정보 수정</h2>
                        <div className="edit-division-line"></div>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="id">아이디</label>
                            <input
                                type="text"
                                id="id"
                                value={id}
                                disabled
                            />

                            <label htmlFor="name">이름</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />

                            <label htmlFor="email">이메일</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <label htmlFor="gender">성별</label>
                            <input
                                type="text"
                                id="gender"
                                value={gender}
                                disabled
                            />

                            <label htmlFor="current-password">기존 비밀번호</label>
                            <input
                                type="password"
                                id="current-password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="현재 비밀번호를 입력하세요"
                            />

                            <label htmlFor="new-password">새로운 비밀번호</label>
                            <input
                                type="password"
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="최소 6자리 ~ 최대 20자리"
                            />

                            <label htmlFor="department">학과명</label>
                            <input
                                type="text"
                                id="department"
                                value={department}
                                disabled
                            />

                            <label htmlFor="phone">전화번호</label>
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="010-0000-0000 또는 01012345678"
                                required
                            />

                            <button type="submit">회원정보 수정</button>
                        </form>
                    </section>
                </main>
            </div>
            <Footer />
        </div>

    );
};

export default PersonInfoEdit;
