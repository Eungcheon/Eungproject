import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../MainPage/RecruitmentSidebar";
import "../RecruitmentBoard/SuggestBoardPage.css";
import "../RecruitmentBoard/SuggestBoard.css";

import Graystar from "../img/Graystar.png"; // 비즐겨찾기 이미지
import Goldstar from "../img/Goldstar.png"; // 즐겨찾기 이미지
import Download from "../img/Download.png"; // 첨부 아이콘 이미지

function SuggestBoard() {
  const [boardList, setBoardList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [choiceVal, setChoiceVal] = useState("title");
  const [searchVal, setSearchVal] = useState("");

  const [favorites, setFavorites] = useState({});

  // 📌 백엔드 API에서 게시글 목록 가져오기
  useEffect(() => {
    fetchBoardList();
  }, [currentPage]); // 페이지 변경될 때마다 API 호출

  const fetchBoardList = async () => {
    try {
      const response = await axios.post("http://localhost:8090/api/board/search", {
        page: currentPage - 1, // 백엔드는 0부터 시작
        size: itemsPerPage,
        searchBy: choiceVal,
        searchQuery: searchVal,
      });
      setBoardList(response.data.content);
    } catch (error) {
      console.error("게시글 목록 불러오기 실패:", error);
    }
  };

  // 📌 검색 버튼 클릭 시 API 호출
  const handleSearch = () => {
    setCurrentPage(1);
    fetchBoardList();
  };

  // 📌 즐겨찾기 토글 기능
  const toggleFavorite = (boardId) => {
    setFavorites((prevFavorites) => {
      const isFavorite = !prevFavorites[boardId];
      alert(isFavorite ? "즐겨찾기에 추가되었습니다!" : "즐겨찾기에서 삭제되었습니다!");
      return { ...prevFavorites, [boardId]: isFavorite };
    });
  };

  // 📌 파일 다운로드 기능 (임시)
  const handleAttachmentClick = (boardId) => {
    const isConfirmed = window.confirm("다운로드 하시겠습니까?");
    if (isConfirmed) {
      alert(`보드 ${boardId}의 첨부 파일이 다운로드 됩니다.`);
    }
  };

  // 📌 페이지네이션 관련 변수
  const totalPages = Math.ceil(boardList.length / itemsPerPage);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const currentItems = boardList.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "280px" }}>
        <Sidebar />
      </div>
      <div style={{ flex: 1, padding: "70px" }}>
        {/* 검색 */}
        <table className="suggest-search">
          <tbody>
            <tr>
              <td>
                <span className="suggest-board-name">추천 채용공고</span>
              </td>
              <td>
                <select
                  className="suggest-custom-select"
                  value={choiceVal}
                  onChange={(event) => setChoiceVal(event.target.value)}
                >
                  <option value="title">제목</option>
                  <option value="content">내용</option>
                  <option value="writer">작성자</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  className="suggest-form-control"
                  placeholder="검색어"
                  value={searchVal}
                  onChange={(event) => setSearchVal(event.target.value)}
                />
              </td>
              <td>
                <button
                  type="button"
                  className="suggest-btn suggest-btn-outline-secondary"
                  onClick={handleSearch}
                >
                  <i className="fas fa-search"></i> 검색
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <br />

        {/* 게시판 */}
        <table className="suggest-table suggest-table-hover">
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
              <tr key={bbs.id}>
                <td onClick={() => toggleFavorite(bbs.id)} style={{ textAlign: "center", cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <img src={favorites[bbs.id] ? Goldstar : Graystar} alt="즐겨찾기" style={{ width: "20px", height: "20px" }} />
                  </div>
                </td>
                <td>{indexOfFirstItem + idx + 1}</td>
                <td>
                  <Link to={`/bbsdetail/${bbs.id}`}>{bbs.title}</Link>
                </td>
                <td>{bbs.writerName}</td>
                <td style={{ textAlign: "center" }}>{bbs.viewCount}</td>
                <td
                  style={{ textAlign: "center", cursor: "pointer" }}
                  onClick={() => handleAttachmentClick(bbs.id)}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <img src={Download} alt="첨부" style={{ width: "20px", height: "20px" }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className="suggest-pagination">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            «
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <span key={index} className={`suggest-page-number ${currentPage === index + 1 ? "active" : ""}`} onClick={() => setCurrentPage(index + 1)}>
              {index + 1}
            </span>
          ))}
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            »
          </button>
        </div>

        {/* 글쓰기 버튼 */}
        <div className="suggest-write-container">
          <Link className="suggest-card-button" to="/SuggestWrite">
            <i className="fas fa-pen"></i> &nbsp; 글 쓰기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SuggestBoard;
