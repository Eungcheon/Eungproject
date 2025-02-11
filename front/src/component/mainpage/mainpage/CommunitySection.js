import React from "react"
import { Link } from "react-router-dom"
import "./CommunitySection.css"

const CommunitySection = () => {
  const notices = [
    { id: 1, title: "2023년 하계 인턴십 프로그램 안내", date: "2023-05-15" },
    { id: 2, title: "취업특강: 이력서 작성법", date: "2023-05-10" },
    { id: 3, title: "5월 채용설명회 일정", date: "2023-05-05" },
  ]

  return (
    <div className="community-section">
      <div className="notice-board">
        <h2 className="section-title">공지사항</h2>
        <ul className="notice-list">
          {notices.map((notice) => (
            <li key={notice.id} className="notice-item">
              <Link to={`/notice/${notice.id}`} className="notice-link">
                {notice.title}
              </Link>
              <span className="notice-date">{notice.date}</span>
            </li>
          ))}
        </ul>
        <Link to="/notices" className="more-link">
          더 보기
        </Link>
      </div>
      <div className="community-board">
        <h2 className="section-title">커뮤니티</h2>
        <div className="community-links">
          <Link to="/faq" className="community-link">
            <h3 className="community-link-title">자주 묻는 질문 (FAQ)</h3>
            <p className="community-link-description">취업 관련 자주 묻는 질문들을 확인하세요.</p>
          </Link>
          <Link to="/qna" className="community-link">
            <h3 className="community-link-title">Q&A</h3>
            <p className="community-link-description">취업 관련 질문을 남기고 답변을 받아보세요.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CommunitySection