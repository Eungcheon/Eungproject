import React from "react";
import "./styles/JobProgram.css"; // 스타일 파일 가져오기

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-blue">
      <div className="container-fluid">
        <a className="navbar-brand text-white" href="#">
          대학일자리플러스센터
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
                재학생 맞춤형 고용서비스
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
                채용정보
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
                프로그램
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
                상담
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
                직무 멘토링
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
                취업자료실
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
                커뮤니티
              </a>
            </li>
          </ul>
          <button className="btn btn-login">로그인</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;