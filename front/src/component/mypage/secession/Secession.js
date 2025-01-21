import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅
import './Secession.css';
import Footer from '../page/Footer';
import Header from '../page/Header';
import Sidebar from '../page/Sidebar';

const Secession = () => {
    const [password, setPassword] = useState(''); // 입력된 비밀번호 상태
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    // 폼 제출 핸들러
    const handleSubmit = (event) => {
        event.preventDefault(); // 기본 폼 제출 동작 방지

        // 비밀번호 확인 로직 (예: "password123"이 맞는 비밀번호라고 가정)
        if (password === 'password123') {
            alert('회원탈퇴가 완료되었습니다');
            navigate('/'); // 메인 페이지로 이동
        } else {
            alert('비밀번호가 올바르지 않습니다. 다시 입력해주세요');
            setPassword(''); // 잘못된 비밀번호 입력 후 초기화
        }
    };

    return (
        <div>
            <Header />
            <div className="secession-container">
                <main className="secession-main">
                    <Sidebar />
                    <section className="secession-form-container">
                        <h1>회원 탈퇴</h1>
                        <div className="secession-division-line"></div>
                        <form onSubmit={handleSubmit}>
                            <div className="secession-text">
                                그동안 서비스를 이용해 주셔서 대단히 감사합니다.
                                <br />
                                회원 탈퇴를 하시면 회원님의 모든 정보가 완전히 삭제됩니다.
                                <br />
                                또한 탈퇴 시, 사용한 아이디로 재가입이 되지 않으니 이 점 양해 부탁드립니다.
                            </div>
                            <div className="secession-line"></div>
                            <label htmlFor="password">비밀번호 확인</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                required
                            />
                            <button type="submit">회원 탈퇴</button>
                        </form>
                    </section>
                </main>
            </div>
            <Footer />
        </div>

    );
};

export default Secession;
