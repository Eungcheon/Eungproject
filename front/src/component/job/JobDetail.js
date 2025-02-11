import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faGraduationCap,
  faUniversity,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCalendarAlt,
  faUserFriends,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/JobDetail.css";

const JobDetail = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [showMoreSummary, setShowMoreSummary] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [selectedSchedules, setSelectedSchedules] = useState([]); // ✅ 일정 선택 상태 추가
  const userId = 1; // ✅ 예제용 유저 ID (실제 로그인된 사용자 ID 사용)

  useEffect(() => {
    const fetchProgramDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8090/api/programs/${programId}`);
        if (!response.ok) throw new Error("프로그램 데이터를 불러오지 못했습니다.");
        const data = await response.json();
        console.log("Fetched program data:", data);
        setProgram(data);

        // ✅ 신청 여부 확인 (사용자 ID가 applicants 배열에 있는지 체크)
        if (data.applicants && data.applicants.includes(userId)) {
          setIsApplied(true);
        }
      } catch (error) {
        console.error("프로그램 상세 데이터 로드 오류:", error);
      }
    };

    fetchProgramDetail();
  }, [programId]);

  const handleScheduleSelect = (index) => {
    setSelectedSchedules((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  const handleApply = async () => {
    if (isApplied) {
      alert("이미 신청한 프로그램입니다.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8090/api/programs/${programId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userId), // ✅ userId 전송
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "신청 실패");
      }

      alert("신청이 완료되었습니다!");
      setIsApplied(true);

      // ✅ 신청 완료 후 ProgramView 페이지로 이동
      navigate("/programs");
    } catch (error) {
      alert(error.message || "신청에 실패했습니다.");
      console.error("신청 오류:", error);
    }
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    setFavoriteCount((prevCount) => (isFavorited ? prevCount - 1 : prevCount + 1));
  };

  const toggleShowMoreSummary = () => {
    setShowMoreSummary(!showMoreSummary);
  };

  return (
    <div className="job-detail-container">
      {program ? (
        <>
          {/* Header Section */}
          <div className="job-detail-header">
            <div className="job-detail-image-container">
              {program.imageUrl ? (
                <img
                  src={`http://localhost:8090/api/programs/images/${program.imageUrl}`}
                  alt={program.name}
                  className="job-detail-image"
                />
              ) : (
                <p>이미지가 없습니다.</p>
              )}
            </div>
            <div className="job-detail-info-container">
              <h1 className="job-detail-title">{program.name}</h1>
              <hr className="job-detail-divider" />
              <div className="job-detail-details">
                <p>
                  <FontAwesomeIcon icon={faUsers} className="job-detail-icon" />
                  <strong> 모집대상:</strong> {program.target || "모집 대상 없음"}
                </p>
                <p>
                  <FontAwesomeIcon icon={faGraduationCap} className="job-detail-icon" />
                  <strong> 학년/성별:</strong> {program.gradeGender || "정보 없음"}
                </p>
                <p>
                  <FontAwesomeIcon icon={faUniversity} className="job-detail-icon" />
                  <strong> 학과:</strong> {program.department || "학과 정보 없음"}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="job-detail-bottom-section">
            <div className="job-detail-poster-info">
              <p>
                <strong>{program.posterName}</strong>
              </p>
              <p>
                <FontAwesomeIcon icon={faEnvelope} className="job-detail-icon" />
                <span> {program.posterEmail || "이메일 정보 없음"}</span>
              </p>
              <p>
                <FontAwesomeIcon icon={faPhone} className="job-detail-icon" />
                <span> {program.posterPhone || "전화번호 정보 없음"}</span>
              </p>
              <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="job-detail-icon" />
                <span> {program.posterLocation || "위치 정보 없음"}</span>
              </p>

              {/* 프로그램 간단한 설명 */}
              <div className={`job-detail-program-summary ${showMoreSummary ? "job-detail-expanded" : ""}`}>
                {program.description || "프로그램 설명이 없습니다."}
              </div>
              <div className="job-detail-show-more-summary-button" onClick={toggleShowMoreSummary}>
                {showMoreSummary ? "간단히" : "더보기"}
              </div>
            </div>

           {/* 일정 Section */}
          <div className="job-detail-description">
            <h3 className="job-detail-schedule-title"></h3>
            <div className="job-detail-schedule-scrollable">
              {program.schedules && program.schedules.length > 0 ? (
                program.schedules.map((schedule, index) => (
                  <div key={index} className="job-detail-schedule-group">
                    {/* ✅ 체크박스를 schedule name과 같은 높이로 정렬 */}
                    <div className="job-detail-schedule-header">
                      <input
                        type="checkbox"
                        checked={selectedSchedules.includes(index)}
                        onChange={() => handleScheduleSelect(index)}
                        className="job-detail-schedule-checkbox"
                      />
                      <h4 className="job-detail-schedule-name">{schedule.scheduleName}</h4>
                    </div>
                    <p>
                      <FontAwesomeIcon icon={faCalendarAlt} className="job-detail-icon" />
                      날짜: {schedule.date}
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faUserFriends} className="job-detail-icon" />
                      최대 신청자: {schedule.maxApplicants}명
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faCheckCircle} className="job-detail-icon" />
                      상태: {schedule.status}
                    </p>
                    {index < program.schedules.length - 1 && <hr className="job-detail-schedule-divider" />}
                  </div>
                ))
              ) : (
                <p>일정 정보가 없습니다.</p>
              )}
            </div>
          </div>
          </div>

          {/* 신청 버튼 & 찜 기능 */}
          <div className="job-detail-action-buttons">
            <button
              className="job-detail-apply-button"
              onClick={handleApply}
              disabled={isApplied || program.currentParticipants >= program.maxParticipants}
            >
              {isApplied ? "신청 완료" : program.currentParticipants >= program.maxParticipants ? "마감됨" : "신청하기"}
            </button>
            <div className="job-detail-favorite-container" onClick={toggleFavorite}>
              <span className={`job-detail-favorite-icon ${isFavorited ? "active" : ""}`}>★</span>
              <span className="job-detail-favorite-count">{favoriteCount}</span>
            </div>
          </div>
        </>
      ) : (
        <p>프로그램 정보를 불러올 수 없습니다.</p>
      )}
    </div>
  );
};

export default JobDetail;