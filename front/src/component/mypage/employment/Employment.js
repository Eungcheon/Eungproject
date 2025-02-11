import React, { useState, useEffect } from 'react';
import './Employment.css';
import Sidebar from '../page/Sidebar';

const Employment = () => {
    const [activeTab, setActiveTab] = useState("tab1");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [removingItems, setRemovingItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // ✅ 검색어 상태 추가
    const [filteredData, setFilteredData] = useState([]); // ✅ 검색된 데이터 저장


    // ✅ 각 탭에 15개씩 데이터 추가 (페이지네이션 확인 가능)
    const [jobData, setJobData] = useState({
        tab1: [...Array(15)].map((_, i) => ({
            id: i + 1,
            company: "삼성",
            details: `연봉 ${5000 + i * 10}만원 / 한국 / 주 40시간`,
            education: "학사 이상",
            registered: "2025-01-17",
            deadline: `2025-02-${String(1 + (i % 10)).padStart(2, '0')}`,
            isFavorite: true,
        })),
        tab2: [...Array(15)].map((_, i) => ({
            id: i + 16,
            company: "LG",
            details: `연봉 ${4800 + i * 10}만원 / 한국 / 주 40시간`,
            education: "학사 이상",
            registered: "2025-01-17",
            deadline: `2025-02-${String(2 + (i % 10)).padStart(2, '0')}`,
            isFavorite: true,
        })),
        tab3: [...Array(15)].map((_, i) => ({
            id: i + 31,
            company: "네이버",
            details: `연봉 협의 / 서울 / 주 40시간`,
            education: "학사 이상",
            registered: "2025-01-17",
            deadline: `2025-02-${String(3 + (i % 10)).padStart(2, '0')}`,
            isFavorite: true,
        })),
        tab4: [...Array(15)].map((_, i) => ({
            id: i + 46,
            company: "카카오",
            details: `연봉 협의 / 경기 / 주 40시간`,
            education: "학사 이상",
            registered: "2025-01-17",
            deadline: `2025-02-${String(4 + (i % 10)).padStart(2, '0')}`,
            isFavorite: true,
        })),
    });

    useEffect(() => {
        const removeExpiredJobs = () => {
            setJobData((prevJobData) => {
                const updatedJobData = { ...prevJobData };
                let dataChanged = false;

                Object.keys(updatedJobData).forEach((tab) => {
                    const filteredData = updatedJobData[tab].filter((job) => {
                        const deadlineDate = new Date(job.deadline);
                        const today = new Date();
                        const daysDiff = Math.ceil((today - deadlineDate) / (1000 * 60 * 60 * 24));

                        return daysDiff <= 2; // 마감일이 2일 이상 지난 항목 삭제
                    });

                    if (filteredData.length !== updatedJobData[tab].length) {
                        dataChanged = true;
                        updatedJobData[tab] = filteredData;
                    }
                });

                return dataChanged ? updatedJobData : prevJobData;
            });
        };

        removeExpiredJobs(); // 처음 렌더링될 때 한 번 실행
        const interval = setInterval(removeExpiredJobs, 24 * 60 * 60 * 1000); // 24시간마다 실행

        return () => clearInterval(interval);
    }, []);


    const isPastDeadline = (deadline) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(0, 0, 0, 0);
        return deadlineDate < today;
    };

    const sortByDeadline = (data) => [...data].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    // 검색어 필터링 추가
    const paginateData = () => {
        const dataToPaginate = searchQuery.trim() ? filteredData : jobData[activeTab] || [];
        const sortedData = sortByDeadline(dataToPaginate);
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(startIndex, startIndex + itemsPerPage);
    };

    const totalItems = searchQuery.trim() ? filteredData.length : jobData[activeTab]?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // ⭐ 즐겨찾기 해제 시 즉시 삭제 + 현재 페이지가 비면 이전 페이지로 이동 + 탭 유지
    const toggleFavorite = (jobId) => {
        setRemovingItems((prev) => [...prev, jobId]);

        setTimeout(() => {
            setJobData((prevJobData) => {
                const updatedData = prevJobData[activeTab].filter((job) => job.id !== jobId);
                const updatedJobData = { ...prevJobData, [activeTab]: updatedData };

                // 🔥 삭제 후 최신 데이터 확인
                const sortedItems = sortByDeadline(updatedJobData[activeTab] || []);
                const remainingItemsOnPage = sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

                // 🔥 현재 페이지가 비었고, 이전 페이지가 있으면 이전 페이지로 이동
                if (remainingItemsOnPage.length === 0 && currentPage > 1) {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                }

                return updatedJobData;
            });

            setRemovingItems((prev) => prev.filter((id) => id !== jobId));
        }, 500);
    };

    // 🕒 마감 상태 계산 함수
    const getDeadlineStatus = (deadline) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(0, 0, 0, 0);

        const timeDiff = deadlineDate - today;
        const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysRemaining < 0) return "❌";
        if (daysRemaining <= 2) return "⚠️";
        return "✔️";
    };

    // 검색어 입력 처리 및 검색 후 데이터 저장
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        if (query.trim() === "") {
            // ✅ 검색어가 없을 때 → 기존 activeTab 데이터 사용
            setFilteredData([]);
        } else {
            // ✅ 검색어가 있을 때 → 모든 탭의 데이터에서 검색
            const allData = Object.values(jobData).flat();
            const results = allData.filter((job) =>
                job.company.toLowerCase().includes(query) ||
                job.details.toLowerCase().includes(query) ||
                job.education.toLowerCase().includes(query)
            );

            setFilteredData(results); // ✅ 검색된 데이터 저장
        }

        setCurrentPage(1); // ✅ 검색 시 첫 번째 페이지로 이동
    };


    return (
        <div>
            <div className="emp-container">
                <main className="emp-main">
                    <Sidebar />
                    <section className="emp-form-container">
                        <h2>나의 채용 정보</h2>
                        <div className="emp-division-line"></div>

                        {/* 🔍 검색 입력창 추가 */}
                        <input
                            type="text"
                            placeholder="검색어를 입력하세요"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="emp-search-input"
                        />

                        {/* 🔍 검색 중이 아닐 때만 탭 표시 */}
                        {!searchQuery.trim() && (
                            <ul className="emp-tabs">
                                {Object.keys(jobData).map((tab) => (
                                    <li key={tab} className={`emp-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                                        {tab === "tab1" ? "교내 채용" : tab === "tab2" ? "추천 채용" : tab === "tab3" ? "외부 채용" : "인턴 채용"}
                                    </li>
                                ))}
                            </ul>
                        )}


                        {totalItems > 0 && (
                            <div className='emp-getDeadlineStatus'>❌: 마감됨  ⚠️: 임박  ✔️: 진행중</div>
                        )}

                        {totalItems === 0 ? (
                            <div className="no-data-message">최근에 즐겨찾기한 채용 정보가 없습니다.</div>
                        ) : (
                            <table className="emp-table">
                                <thead>
                                    <tr>
                                        {/* 🔍 검색 중이 아닐 때만 "즐겨찾기" 컬럼 표시 */}
                                        {!searchQuery.trim() && <th>즐겨찾기</th>}
                                        <th>회사명</th>
                                        <th>채용 정보</th>
                                        <th>학력 / 경력</th>
                                        <th>등록일</th>
                                        <th>마감일</th>
                                        <th>마감 상태</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginateData().map((job) => (
                                        <tr key={job.id} className={removingItems.includes(job.id) ? "fade-out-left" : ""}>
                                            {/* 🔍 검색 중이 아닐 때만 "즐겨찾기" 아이콘 표시 */}
                                            {!searchQuery.trim() && (
                                                <td>
                                                    <span className="star" onClick={() => toggleFavorite(job.id)} style={{ cursor: 'pointer', color: 'gold' }}>
                                                        ⭐
                                                    </span>
                                                </td>
                                            )}
                                            <td className={isPastDeadline(job.deadline) ? "gray-text" : ""}>{job.company}</td>
                                            <td className={isPastDeadline(job.deadline) ? "gray-text" : ""}>{job.details}</td>
                                            <td className={isPastDeadline(job.deadline) ? "gray-text" : ""}>{job.education}</td>
                                            <td className={isPastDeadline(job.deadline) ? "gray-text" : ""}>{job.registered}</td>
                                            <td className={isPastDeadline(job.deadline) ? "gray-text" : ""}>{job.deadline}</td>
                                            <td>{getDeadlineStatus(job.deadline)}</td>
                                        </tr>
                                    ))}
                                </tbody>


                            </table>
                        )}

                        {/* 페이지네이션 (2페이지 이상일 때만 표시) */}
                        {totalPages > 1 && (
                            <div className="emp-pagination">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        className={currentPage === i + 1 ? "active" : ""}
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Employment;
