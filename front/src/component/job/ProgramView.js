import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

function ProgramView() {
  const [programs, setPrograms] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("latest");
  const programsPerPage = 6; // 페이지당 최대 6개

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: "ws://localhost:8090/ws",
      onConnect: () => {
        console.log("WebSocket 연결 성공");
        stompClient.subscribe("/topic/programs", (message) => {
          try {
            const newProgram = JSON.parse(message.body);

            // 기본값 추가
            const updatedProgram = {
              ...newProgram,
              currentParticipants: newProgram.currentParticipants || 0,
              maxParticipants: newProgram.maxParticipants || 1, // 기본값 1
            };

            setPrograms((prevPrograms) => [updatedProgram, ...prevPrograms]);
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

      // 기본값 추가
      const updatedData = data.map((program) => ({
        ...program,
        currentParticipants: program.currentParticipants || 0,
        maxParticipants: program.maxParticipants || 1, // 기본값 1
      }));

      setPrograms(updatedData);
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
    <div>
      <div className="sorting-section d-flex flex-column align-items-end">
        <div className="d-flex align-items-center mb-2">
          {["endingSoon", "popular", "latest"].map((order) => (
            <div className="form-check me-3" key={order}>
              <input
                className="form-check-input"
                type="radio"
                name="sortOrder"
                id={`sortBy${order}`}
                value={order}
                onChange={() => setSortOrder(order)}
                defaultChecked={order === "latest"}
              />
              <label className="form-check-label" htmlFor={`sortBy${order}`}>
                {order === "endingSoon" && "종료임박순"}
                {order === "popular" && "인기순"}
                {order === "latest" && "최신순"}
              </label>
            </div>
          ))}
        </div>

        <div className="view-icons">
          <i
            className={`bi bi-grid ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="그리드 보기"
          ></i>
          <i
            className={`bi bi-list ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
            title="리스트 보기"
          ></i>
        </div>
      </div>

      <p className="program-count">총 {programs.length}개</p>
      <div className="program-container">
        {viewMode === "grid" ? (
          <div className="program-grid">
            <div className="row g-3">
              {currentPrograms.map((program) => (
                <div className="col-md-6" key={program.id}>
                  <div className="card">
                    {program.imageUrl && (
                      <img
                        src={`http://localhost:8090/api/programs/images/${program.imageUrl}`}
                        alt={program.name}
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    )}
                    <div className="card-body">
                      <div className="program-title">
                        <h5 className="card-title">{program.name}</h5>
                        <i
                          className={`bi ${
                            program.isFavorite ? "bi-star-fill text-warning" : "bi-star"
                          } favorite-icon`}
                          onClick={() => toggleFavorite(program.id)}
                        ></i>
                      </div>
                      <p>
                        {program.startDate} ~ {program.endDate}
                      </p>
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar"
                          style={{
                            width: `${
                              program.maxParticipants > 0
                                ? (program.currentParticipants / program.maxParticipants) * 100
                                : 0
                            }%`,
                          }}
                        >
                          {program.maxParticipants > 0
                            ? `${Math.round(
                                (program.currentParticipants / program.maxParticipants) * 100
                              )}%`
                            : "0%"}
                        </div>
                      </div>
                      <p>
                        현재 신청자: {program.currentParticipants} / 최대 {program.maxParticipants}명
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ul className="program-list">
            {currentPrograms.map((program) => (
              <li key={program.id}>
                <div className="program-title">
                  <h5>{program.name}</h5>
                  <i
                    className={`bi ${
                      program.isFavorite ? "bi-star-fill text-warning" : "bi-star"
                    } favorite-icon`}
                    onClick={() => toggleFavorite(program.id)}
                  ></i>
                </div>
                <p>
                  {program.startDate} ~ {program.endDate}
                </p>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${
                        program.maxParticipants > 0
                          ? (program.currentParticipants / program.maxParticipants) * 100
                          : 0
                      }%`,
                    }}
                  >
                    {program.maxParticipants > 0
                      ? `${Math.round(
                          (program.currentParticipants / program.maxParticipants) * 100
                        )}%`
                      : "0%"}
                  </div>
                </div>
                <p>
                  현재 신청자: {program.currentParticipants} / 최대 {program.maxParticipants}명
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              &laquo;
            </button>
          </li>
          {[...Array(totalPages).keys()].map((_, index) => (
            <li className={`page-item ${index + 1 === currentPage ? "active" : ""}`} key={index}>
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default ProgramView;