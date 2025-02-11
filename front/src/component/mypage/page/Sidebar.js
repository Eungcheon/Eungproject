import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="mysidebar">
            <h3>마이페이지</h3>
            <div className="mysidebar-division-line"></div>
            <ul>
                <li><a href="/myEdit">개인정보 수정</a></li>
                <li><a href="/mySecession">회원탈퇴</a></li>
                <li><a href="/myEmployment">나의 채용 정보</a></li>
                <li><a href="/myProgram">나의 취업 프로그램</a></li>
                <li><a href="/myCounsel">나의 최근 상담</a></li>
            </ul>
        </aside>
    );
};

export default Sidebar;
