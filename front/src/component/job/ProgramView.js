import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardCheck } from "@fortawesome/free-solid-svg-icons";

function ProgramView() {
  const [programs, setPrograms] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("latest");
  const programsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: "ws://localhost:8090/ws",
      onConnect: () => {
        console.log("WebSocket 연결 성공");
        stompClient.subscribe("/topic/programs", (message) => {
          try {
            const updatedProgram = JSON.parse(message.body);
            setPrograms((prevPrograms) =>
              prevPrograms.map((program) =>
                program.id === updatedProgram.id ? updatedProgram : program
              )
            );
          } catch (error) {
            console.error("WebSocket 메시지 처리 오류:", error);
          }
        });
      },
    });

    stompClient.activate();
    fetchPrograms();

    return () => stompClient.deactivate();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch("http://localhost:8090/api/programs");
      if (!response.ok) throw new Error("프로그램 데이터를 불러오는 데 실패했습니다.");
      const data = await response.json();
      setPrograms(data);
    } catch (error) {
      console.error("프로그램 데이터 로드 오류:", error);
    }
  };

  const toggleFavorite = (programId) => {
    setPrograms((prevPrograms) =>
      prevPrograms.map((program) =>
        program.id === programId
          ? { ...program, isFavorite: !program.isFavorite }
          : program
      )
    );
  };

  const handleViewDetails = (programId) => {
    navigate(`/programs/${programId}`);
  };

  const formatDateWithDay = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const weekDay = date.toLocaleDateString("ko-KR", { weekday: "short" });
    return `${year}.${month}.${day}(${weekDay})`;
  };

  const sortedPrograms = [...programs].sort((a, b) => {
    if (sortOrder === "endingSoon") {
      return new Date(a.endDate) - new Date(b.endDate);
    } else if (sortOrder === "popular") {
      return b.maxParticipants - a.maxParticipants;
    } else {
      return new Date(b.startDate) - new Date(a.startDate);
    }
  });

  const totalPages = Math.ceil(sortedPrograms.length / programsPerPage);
  const startIndex = (currentPage - 1) * programsPerPage;
  const currentPrograms = sortedPrograms.slice(startIndex, startIndex + programsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="program-view-container">
      <div className="program-view-sorting-section d-flex flex-column align-items-end">
        <div className="d-flex align-items-center mb-2">
          {["endingSoon", "popular", "latest"].map((order) => (
            <div className="form-check me-3 program-view-sort-option" key={order}>
              <input
                className="form-check-input program-view-sort-input"
                type="radio"
                name="sortOrder"
                id={`program-view-sortBy${order}`}
                value={order}
                onChange={() => setSortOrder(order)}
                defaultChecked={order === "latest"}
              />
              <label className="form-check-label program-view-sort-label" htmlFor={`program-view-sortBy${order}`}>
                {order === "endingSoon" && "종료임박순"}
                {order === "popular" && "인기순"}
                {order === "latest" && "최신순"}
              </label>
            </div>
          ))}
        </div>

        <div className="program-view-view-icons">
          <i className={`bi bi-grid ${viewMode === "grid" ? "program-view-active" : ""}`} onClick={() => setViewMode("grid")} title="그리드 보기"></i>
          <i className={`bi bi-list ${viewMode === "list" ? "program-view-active" : ""}`} onClick={() => setViewMode("list")} title="리스트 보기"></i>
        </div>
      </div>

      <p className="program-view-program-count">총 {programs.length}개</p>
      <div className="program-view-program-container">
        {viewMode === "grid" ? (
          <div className="program-view-program-grid">
            <div className="row g-3">
              {currentPrograms.map((program) => (
                <div className="col-md-6 program-view-grid-item" key={program.id}>
                  <div className="card program-view-card" onClick={() => handleViewDetails(program.id)}>
                    {program.imageUrl && (
                      <img src={`http://localhost:8090/api/programs/images/${program.imageUrl}`} alt={program.name} className="program-view-card-img-top" />
                    )}
                    <div className="program-view-card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        
              
                      </div>
                      <div className="program-view-grid-poster-container">
                        <span className="program-view-poster-name">{program.posterName}</span>
                        <i
                          className={`bi ${program.isFavorite ? "bi-star-fill text-warning" : "bi-star"} program-view-favorite-icon`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(program.id);
                          }}
                        ></i>
                      </div>
                      {/* ✅ 프로그램 이름을 더 진하게 */}
                      <h5 className="program-view-card-title">{program.name}</h5>
                      <p className="program-view-dates">
                        <FontAwesomeIcon icon={faClipboardCheck} className="program-view-apply-icon" /> 신청:{" "}
                        {formatDateWithDay(program.startDate)} ~ {formatDateWithDay(program.endDate)}
                      </p>
                      <div className="program-view-progress-bar-container">
                        <div className="program-view-progress-bar" style={{
                          width: `${program.maxParticipants > 0 ? (program.currentParticipants / program.maxParticipants) * 100 : 0}%`,
                        }}>
                          <span className="program-view-progress-text">
                            {program.maxParticipants > 0
                              ? `${Math.round((program.currentParticipants / program.maxParticipants) * 100)}%`
                              : "0%"}
                          </span>
                        </div>
                      </div>
                      <p className="program-view-participants">
                        현재 신청자: {program.currentParticipants}명 / 최대 {program.maxParticipants}명
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ul className="program-view-program-list">
            {currentPrograms.map((program) => (
              <li className="program-view-list-item" key={program.id} onClick={() => handleViewDetails(program.id)}>
                {/* ✅ 리스트 뷰 전용 컨테이너 */}
        <div className="program-view-list-poster-container">
          <p className="program-view-poster-name">{program.posterName}</p>
          <span className="program-view-date">{formatDateWithDay(program.startDate)}~{formatDateWithDay(program.endDate)}</span>
        </div>
                <h5 className="program-view-list-title">
                  {program.name}
                  <i
                    className={`bi ${program.isFavorite ? "bi-star-fill text-warning" : "bi-star"} program-view-favorite-icon`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(program.id);
                    }}
                  ></i>
                </h5>
               

                <div className="program-view-progress-bar-container">
                  <div className="program-view-progress-bar" style={{
                    width: `${program.maxParticipants > 0 ? (program.currentParticipants / program.maxParticipants) * 100 : 0}%`,
                  }}>
                    <span className="program-view-progress-text">
                      {program.maxParticipants > 0
                        ? `${Math.round((program.currentParticipants / program.maxParticipants) * 100)}%`
                        : "0%"}
                    </span>
                  </div>
                </div>
                <p className="program-view-participants">
                  현재 신청자: {program.currentParticipants} / 최대 {program.maxParticipants}명
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 페이지네이션 추가 */}
      <nav className="program-view-pagination mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&laquo;</button>
          </li>
          {[...Array(totalPages).keys()].map((_, index) => (
            <li className={`page-item ${index + 1 === currentPage ? "active" : ""}`} key={index}>
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>&raquo;</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default ProgramView;