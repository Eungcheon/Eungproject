import React, { useState, useMemo } from 'react';
import './Counsel.css';
import Sidebar from '../page/Sidebar';

const ITEMS_PER_PAGE = 10;

const Counsel = () => {
    const [activeTab, setActiveTab] = useState("tab1");
    const [currentPage, setCurrentPage] = useState(1);
    const [showPastTab, setShowPastTab] = useState(false); // 처음에는 탭3 숨김
    const now = new Date();
    const [removingItems, setRemovingItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // ✅ 검색어 상태 추가

    const [onlineCounsel, setOnlineCounsel] = useState([
        { id: 1, title: "집에 가고싶어요", author: "고양이", date: "2025-02-10" },
        { id: 2, title: "취업 고민 있어요", author: "강아지", date: "2025-02-11" },
        { id: 3, title: "새로운 고민이 생겼어요", author: "토끼", date: "2025-02-15" },
        { id: 4, title: "이직 고민", author: "여우", date: "2025-02-12" },
        { id: 5, title: "연봉 협상", author: "판다", date: "2025-02-08" },
        { id: 6, title: "집에 가고싶어요", author: "고양이", date: "2025-02-10" },
        { id: 7, title: "취업 고민 있어요", author: "강아지", date: "2025-02-11" },
        { id: 8, title: "새로운 고민이 생겼어요", author: "토끼", date: "2025-02-15" },
        { id: 9, title: "이직 고민", author: "여우", date: "2025-02-12" },
        { id: 10, title: "연봉 협상", author: "판다", date: "2025-02-08" },
        { id: 11, title: "집에 가고싶어요", author: "고양이", date: "2025-02-10" },
        { id: 12, title: "취업 고민 있어요", author: "강아지", date: "2025-02-11" },
        { id: 13, title: "새로운 고민이 생겼어요", author: "토끼", date: "2025-02-15" },
        { id: 14, title: "이직 고민", author: "여우", date: "2025-02-12" },
        { id: 15, title: "연봉 협상", author: "판다", date: "2025-02-08" },
    ].sort((b, a) => new Date(a.date) - new Date(b.date)));

    const [offlineCounsel, setOfflineCounsel] = useState([
        { id: 1, date: "2024-09-03", time: "14:00", room: "상담실 A" },
        { id: 2, date: "2024-02-13", time: "13:00", room: "상담실 B" },
        { id: 3, date: "2024-02-13", time: "14:45", room: "상담실 C" },
        { id: 4, date: "2024-02-15", time: "10:00", room: "상담실 D" },
        { id: 5, date: "2024-02-10", time: "11:30", room: "상담실 E" },
        { id: 6, date: "2025-02-10", time: "11:30", room: "상담실 E" },
        { id: 7, date: "2025-02-11", time: "11:30", room: "상담실 E" },
        { id: 8, date: "2025-02-12", time: "11:30", room: "상담실 E" },
        { id: 9, date: "2025-02-07", time: "12:30", room: "상담실 E" },
        { id: 10, date: "2025-02-10", time: "13:30", room: "상담실 E" },
        { id: 11, date: "2025-02-10", time: "14:30", room: "상담실 E" },
        { id: 12, date: "2025-02-10", time: "15:30", room: "상담실 E" },
    ].sort((b, a) => new Date(a.date) - new Date(b.date)));

    const sortedOfflineCounsel = useMemo(() =>
        offlineCounsel.sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)),
        [offlineCounsel]
    );

    const pastCounsel = sortedOfflineCounsel.filter(item => new Date(`${item.date}T${item.time}:00`) < now);
    const upcomingCounsel = sortedOfflineCounsel.filter(item => new Date(`${item.date}T${item.time}:00`) >= now);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);

        if (tab === "tab2") {
            setShowPastTab(true);
        } else if (tab === "tab1") {
            setShowPastTab(false);
        }
    };

    const getCurrentData = () => {
        let data = [];
        if (activeTab === "tab1") data = onlineCounsel;
        else if (activeTab === "tab2") data = upcomingCounsel;
        else if (activeTab === "tab3") data = pastCounsel;

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    const currentData = useMemo(getCurrentData, [onlineCounsel, offlineCounsel, currentPage, activeTab]);

    const totalPages = Math.ceil(
        (activeTab === "tab1" ? onlineCounsel.length :
            activeTab === "tab2" ? upcomingCounsel.length :
                pastCounsel.length) / ITEMS_PER_PAGE
    );

    const toggleSelectItem = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // 선택 삭제 (삭제 애니메이션 적용)
    const handleDeleteSelected = () => {
        if (!selectedItems || selectedItems.length === 0) { // ✅ selectedItems가 undefined/null이 아닌지 체크
            alert("삭제할 항목을 선택해주세요.");
            return;
        }

        if (window.confirm("선택한 항목을 삭제하시겠습니까?")) {
            setRemovingItems(selectedItems); // ✅ 삭제 애니메이션 적용

            setTimeout(() => {
                if (activeTab === "tab1") {
                    setOnlineCounsel(prev => prev.filter(item => !selectedItems.includes(item.id))); // ✅ 온라인 상담 삭제
                } else if (activeTab === "tab2") {
                    setOfflineCounsel(prev => prev.filter(item => !selectedItems.includes(item.id))); // ✅ 오프라인 상담 삭제
                } else if (activeTab === "tab3") {
                    setOfflineCounsel(prev => prev.filter(item => !selectedItems.includes(item.id))); // ✅ 지난 상담 삭제
                }

                setSelectedItems([]); // ✅ 선택 초기화
                setRemovingItems([]); // ✅ 삭제 애니메이션 초기화
            }, 500); // ✅ 0.5초 후 삭제
        }
    };

    // 전체 선택 
    const handleSelectAll = () => {
        const allIds = currentData.map(item => item.id);
        if (selectedItems.length === allIds.length) {
            setSelectedItems([]); // 전체 해제
        } else {
            setSelectedItems(allIds); // 전체 선택
        }
    };

    // 검색어 입력 핸들러 추가 
    const handleSearch = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
        setCurrentPage(1); // ✅ 검색 시 첫 페이지로 이동
    };


    return (
        <div>
            <div className="mycounsel-container">
                <main className="mycounsel-main">
                    <Sidebar />
                    <section className="mycounsel-form-container">
                        <h2>나의 최근 상담</h2>
                        <div className="mycounsel-division-line"></div>

                        <input
                            type="text"
                            placeholder="검색어를 입력하세요"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="mycounsel-search-input"
                        />

                        <ul className="mycounsel-tabs">
                            <li className={`mycounsel-tab ${activeTab === "tab1" ? "active" : ""}`} onClick={() => handleTabClick("tab1")}>온라인 상담</li>
                            <li className={`mycounsel-tab ${activeTab === "tab2" ? "active" : ""}`} onClick={() => handleTabClick("tab2")}>오프라인 상담</li>
                            {showPastTab && pastCounsel.length > 0 && (
                                <li className={`mycounsel-tab ${activeTab === "tab3" ? "active" : ""}`} onClick={() => handleTabClick("tab3")}>지난 상담</li>
                            )}
                        </ul>

                        <div className="mycounsel-tab-content">
                            {currentData.length === 0 ? (
                                <div className="no-data-message">
                                    {activeTab === "tab1" ? "최근 나의 온라인 상담이 없습니다" : "최근 나의 상담이 없습니다"}
                                </div>
                            ) : (
                                <>
                                    {/* 🔍 검색 중이 아닐 때만 삭제 버튼 표시 */}
                                    {!searchQuery.trim() && (
                                        <div className="mycounsel-delete-controls">
                                            <button className="mycounsel-delete-btn" onClick={handleDeleteSelected}>삭제</button>
                                        </div>
                                    )}



                                    <table className="mycounsel-table">
                                        <thead>
                                            <tr>
                                                {/* 🔍 검색 중이 아닐 때만 "즐겨찾기" 컬럼 표시 */}
                                                {!searchQuery.trim() && (
                                                    <th onClick={handleSelectAll} style={{ cursor: "pointer", textAlign: "center" }}>
                                                        {selectedItems.length > 0 && selectedItems.length === currentData.length ? "✔️" : "✔️"}
                                                    </th>
                                                )}
                                                {activeTab === "tab1" ? <>
                                                    <th>상담 날짜</th>
                                                    <th>제목</th>
                                                    <th>작성자</th>
                                                </> : <>
                                                    <th>신청 날짜</th>
                                                    <th>신청 시간</th>
                                                    <th>상담실</th>
                                                </>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentData.map((item) => (
                                                <tr key={item.id}
                                                    className={removingItems.includes(item.id) ? "fade-out-right" : ""}
                                                    style={{ cursor: "pointer", textAlign: "center" }}
                                                >
                                                    {/* 🔍 검색 중이 아닐 때만 체크박스 표시 */}
                                                    {!searchQuery.trim() && (
                                                        <td className="mycounsel-checkbox-container">
                                                            <input
                                                                type="checkbox"
                                                                id={`checkbox-${item.id}`}
                                                                checked={selectedItems.includes(item.id)}
                                                                onChange={() => toggleSelectItem(item.id)}
                                                            />
                                                            <label htmlFor={`checkbox-${item.id}`} className="mycounsel-checkbox-label"></label>
                                                        </td>
                                                    )}

                                                    {activeTab === "tab1" ? (
                                                        <>
                                                            <td>{item.date}</td>
                                                            <td>{item.title}</td>
                                                            <td>{item.author}</td>
                                                        </>
                                                    ) : activeTab === "tab2" ? (
                                                        <>
                                                            <td>{item.date}</td>
                                                            <td>{item.time}</td>
                                                            <td>{item.room}</td>
                                                        </>
                                                    ) : (
                                                        // 지난 상담 (tab3) - 회색 글씨 적용
                                                        <>
                                                            <td className="gray-text">{item.date}</td>
                                                            <td className="gray-text">{item.time}</td>
                                                            <td className="gray-text">{item.room}</td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                </>
                            )}
                        </div>

                        {/* 페이지네이션 */}
                        {totalPages > 1 && (
                            <div className="mycounsel-pagination">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        className={`mycounsel-pagination-button ${currentPage === i + 1 ? "active" : ""}`}
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

export default Counsel;
