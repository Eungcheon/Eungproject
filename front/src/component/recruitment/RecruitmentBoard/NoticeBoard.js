import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../MainPage/RecruitmentSidebar";
import "../RecruitmentBoard/NoticeBoardPage.css";
import "../RecruitmentBoard/NoticeBoard.css";

import Graystar from "../img/Graystar.png";  // 비즐겨찾기 이미지
import Goldstar from "../img/Goldstar.png";  // 즐겨찾기 이미지
import Download from "../img/Download.png"; // 첨부 아이콘 이미지

function NoticeBoard() {
  const [NoticeBoard, setNoticeBoard] = useState([
    { boardId: 1, title: "[군산문화관광재단] 경영기획팀 팀원 채용 (~01/20)", writerName: "대학일자리본부", viewCount: 13 },
    { boardId: 2, title: "[ICN Group] 경영, 물류, 호텔, IT, 디자인 등 해외유급인턴쉽 채용 (~02/03)", writerName: "대학일자리본부", viewCount: 18 },
    { boardId: 3, title: "[리빈] 웹, 패키지 디자이너 채용 (~01/15)", writerName: "대학일자리본부", viewCount: 10 },
    { boardId: 4, title: "[슈프리마] 소프트웨어 엔지니어 인턴 채용 (~01/24)", writerName: "대학일자리본부", viewCount: 12 },
    { boardId: 5, title: "[원광대학교병원] 방사선사, 임상병리사 등 채용 (~01/17)", writerName: "대학일자리본부", viewCount: 10 },
    { boardId: 6, title: "[니프코리아] 인사, 총무, 정보관리, 생산지원 등 신입 채용 (~01/21)", writerName: "대학일자리본부", viewCount: 22 },
    { boardId: 7, title: "[쿠팡] 광고영업 직군 인턴 채용 (~01/22)", writerName: "대학일자리본부", viewCount: 13 },
    { boardId: 8, title: "[대학내일] 마케터, 디자이너, HRD담당자 인턴·신입 대규모 채용 안내 (~01/13)", writerName: "대학일자리본부", viewCount: 15 },
    { boardId: 9, title: "[지미션] 브랜드마케팅, 회원만족, 경영지원 정규직 모집 (~01/08)", writerName: "대학일자리본부", viewCount: 16 },
    { boardId: 10, title: "[MJE] 수출입 담당 및 관리부 업무보조 모집 (~01/23)", writerName: "대학일자리본부", viewCount: 10 },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [choiceVal, setChoiceVal] = useState("");
  const [searchVal, setSearchVal] = useState("");

  const [favorites, setFavorites] = useState({});

  // 즐겨찾기 토글 함수
  const toggleFavorite = (boardId) => {
    setFavorites((prevFavorites) => {
      const isFavorite = !prevFavorites[boardId];
      alert(isFavorite ? "즐겨찾기에 추가되었습니다!" : "즐겨찾기에서 삭제되었습니다!");
      return { ...prevFavorites, [boardId]: isFavorite };
    });
  };

  // 첨부 클릭 시 다운로드 확인 함수
  const handleAttachmentClick = (boardId) => {
    const isConfirmed = window.confirm("다운로드 하시겠습니까?");
    if (isConfirmed) {
      // 실제 다운로드 로직을 여기에 추가하면 됩니다.
      alert(`보드 ${boardId}의 첨부 파일이 다운로드 됩니다.`);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = NoticeBoard.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(NoticeBoard.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "280px" }}>
        <Sidebar />
      </div>
      <div style={{ flex: 1, padding: "70px" }}>
        {/* 검색 */}
        <table className="noticeBoard-search">
          <tbody>
            <tr>
              <td>
                <span className="noticeBoard-board-name">공지사항</span>
              </td>
              <td>
                <select
                  className="noticeBoard-custom-select"
                  value={choiceVal}
                  onChange={(event) => setChoiceVal(event.target.value)}
                >
                  <option>검색 옵션</option>
                  <option value="title">제목</option>
                  <option value="content">내용</option>
                  <option value="writer">작성자</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  className="noticeBoard-form-control"
                  placeholder="검색어"
                  value={searchVal}
                  onChange={(event) => setSearchVal(event.target.value)}
                />
              </td>
              <td>
                <button
                  type="button"
                  className="noticeBoard-btn btn-outline-secondary"
                >
                  <i className="noticeBoard-fas fa-search"></i> 검색
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <br />

        {/* 게시판 */}
        <table className="noticeBoard-table table-hover">
          <thead>
            <tr>
              <th>즐겨찾기</th>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>조회수</th>
              <th>첨부</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((bbs, idx) => (
              <tr key={bbs.boardId}>
                <td
                  onClick={() => toggleFavorite(bbs.boardId)}
                  style={{ textAlign: "center", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <img
                      src={favorites[bbs.boardId] ? Goldstar : Graystar} // 즐겨찾기 이미지 경로
                      alt="즐겨찾기"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </div>
                </td>
                <td>{indexOfFirstItem + idx + 1}</td>
                <td>
                  <Link to={`/bbsdetail/${bbs.boardId}`}>{bbs.title}</Link>
                </td>
                <td>{bbs.writerName}</td>
                <td style={{ textAlign: "center" }}>{bbs.viewCount}</td>
                <td 
                  style={{ textAlign: "center", cursor: "pointer" }} 
                  onClick={() => handleAttachmentClick(bbs.boardId)}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <img
                      src={Download}
                      alt="첨부"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className="noticeBoard-pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            «
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <span
              key={index}
              className={`noticeBoard-page-number ${currentPage === index + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </span>
          ))}
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            »
          </button>
        </div>

        {/* 글쓰기 버튼 */}
        <div
          className="noticeBoard-my-5 centered-container"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Link className="noticeBoard-card-button" to="/NoticeWrite">
            <i className="noticeBoard-fas fa-pen"></i> &nbsp; 글 쓰기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NoticeBoard;
