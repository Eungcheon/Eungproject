import React from 'react';
import { Link } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../api/serverURL';

const Header = () => {
  // localStorage에서 userInfo를 읽어와서 초기값 설정
  const [userRole, setUserRole] = useState(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo?.userRole || '';
  });

  const handleAdminLogin = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/api/login`, {
        userEmail: 'admin@hansei.ac.kr',
        userPassword: 'password1'
      });
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      setUserRole(response.data.userRole);
    } catch (error) {
      console.error('Login error:', error);
    }
    window.location.reload();
  };

  const handleUserLogin = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/api/login`, {
        userEmail: 'hong@hansei.ac.kr',
        userPassword: 'password2'
      });
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      setUserRole(response.data.userRole);
    } catch (error) {
      console.error('Login error:', error);
    }
    window.location.reload();
  };

  return (
    <header>
      <Link to="/counsel">상담</Link>
      &nbsp;&nbsp; | &nbsp;&nbsp;
      <Link to="/community/notice">공지사항</Link>
      &nbsp;&nbsp; | &nbsp;&nbsp;
      <Link to="/community/faq">FAQ</Link>
      &nbsp;&nbsp; | &nbsp;&nbsp;
      <Link to="/community/archive">자료실</Link>
      &nbsp;&nbsp; | &nbsp;&nbsp;
      <button onClick={handleAdminLogin}>관리자 로그인</button>
      &nbsp;&nbsp;
      <button onClick={handleUserLogin}>사용자 로그인</button>
      <div>현재 권한: {userRole || '로그인 필요'}</div>
      <hr />
    </header>
  );
};

export default Header;