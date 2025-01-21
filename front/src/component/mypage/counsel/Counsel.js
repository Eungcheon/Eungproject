import React, { useState } from 'react';
import './Counsel.css';
import Footer from '../page/Footer';
import Header from '../page/Header';
import Sidebar from '../page/Sidebar';

const Counsel = () => {
    const [activeTab, setActiveTab] = useState("tab1");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // 한 페이지에 표시할 데이터 수

    const [onlineCounsel, setOnlineCounsel] = useState([
        { id: 1, title: "집에 가고싶어요", author: "고양이", date: "2025-01-10" },
        { id: 2, title: "취업 고민 있어요", author: "강아지", date: "2025-01-11" },
        { id: 3, title: "취업 고민 있어요", author: "강아지", date: "2025-01-11" },
        { id: 4, title: "취업 고민 있어요", author: "강아지", date: "2025-01-11" },
        { id: 5, title: "취업 고민 있어요", author: "강아지", date: "2025-01-11" },
        { id: 6, title: "취업 고민 있어요", author: "강아지", date: "2025-01-11" },
        { id: 7, title: "취업 고민 있어요", author: "강아지", date: "2025-01-11" },
        { id: 8, title: "취업 고민 있어요", author: "강아지", date: "2025-01-11" },
        { id: 9, title: "취업 고민 있어요", author: "강아지", date: "2025-01-11" },
        { id: 10, title: "취업 고민 있어요", author: "강아지", date: "2025-01-11" },
        { id: 11, title: "취업 고민 있어요", author: "강아지", date: "2025-01-11" },
        { id: 12, title: "취업 고민 있어요", author: "강아지", date: "2025-01-11" },
    ]);
    const [offlineCounsel, setOfflineCounsel] = useState([
        { id: 1, date: "2024-09-03", time: "14:00", room: "상담실 A" },
        { id: 2, date: "2024-10-15", time: "14:00", room: "상담실 B" },
    ]);

    // 탭 클릭 핸들러
    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1); // 탭 변경 시 첫 페이지로 이동
    };

    // 온라인 상담 삭제 핸들러
    const handleOnlineDelete = (id) => {
        setOnlineCounsel((prev) => {
            const updatedData = prev.filter((item) => item.id !== id);
            const totalPages = Math.ceil(updatedData.length / itemsPerPage);
            if (currentPage > totalPages) setCurrentPage(totalPages > 0 ? totalPages : 1);
            return updatedData;
        });
    };

    // 오프라인 상담 취소 핸들러
    const handleOfflineDelete = (id) => {
        setOfflineCounsel((prev) => {
            const updatedData = prev.filter((item) => item.id !== id);
            const totalPages = Math.ceil(updatedData.length / itemsPerPage);
            if (currentPage > totalPages) setCurrentPage(totalPages > 0 ? totalPages : 1);
            return updatedData;
        });
    };

    const paginateData = (data) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage).map((item, index) => ({
            ...item,
            number: startIndex + index + 1,
        }));
    };

    const renderPagination = (dataLength) => {
        const totalPages = Math.ceil(dataLength / itemsPerPage);
        if (totalPages <= 1) return null;

        return (
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <span
                        key={index + 1}
                        className={`page-number ${currentPage === index + 1 ? "active" : ""}`}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div>
            <Header />
            <div className="counsel-container">
                <main className="counsel-main">
                    <Sidebar />
                    <section className="counsel-form-container">
                        <h2>나의 상담 내용</h2>
                        <div className="counsel-division-line"></div>

                        {/* 탭 메뉴 */}
                        <ul className="counsel-tabs">
                            <li
                                className={`counsel-tab ${activeTab === "tab1" ? "active" : ""}`}
                                onClick={() => handleTabClick("tab1")}
                            >
                                온라인 상담
                            </li>
                            <li
                                className={`counsel-tab ${activeTab === "tab2" ? "active" : ""}`}
                                onClick={() => handleTabClick("tab2")}
                            >
                                오프라인 상담
                            </li>
                        </ul>

                        {/* 탭 콘텐츠 */}
                        {activeTab === "tab1" && (
                            <div className="counsel-tab-content">
                                {onlineCounsel.length === 0 ? (
                                    <p className="empty-message">등록된 온라인 상담 내용이 없습니다.</p>
                                ) : (
                                    <>
                                        <table className="counsel-table">
                                            <thead>
                                                <tr>
                                                    <th>번호</th>
                                                    <th>제목</th>
                                                    <th>작성자</th>
                                                    <th>등록일</th>
                                                    <th>관리</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginateData(onlineCounsel).map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.number}</td>
                                                        <td>{item.title}</td>
                                                        <td>{item.author}</td>
                                                        <td>{item.date}</td>
                                                        <td>
                                                            <button
                                                                className="counsel-delete-btn"
                                                                onClick={() => handleOnlineDelete(item.id)}
                                                            >
                                                                삭제
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {renderPagination(onlineCounsel.length)}
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === "tab2" && (
                            <div className="counsel-tab-content">
                                {offlineCounsel.length === 0 ? (
                                    <p className="empty-message">등록된 오프라인 상담 내용이 없습니다.</p>
                                ) : (
                                    <>
                                        <table className="counsel-table">
                                            <thead>
                                                <tr>
                                                    <th>번호</th>
                                                    <th>신청 날짜</th>
                                                    <th>신청 시간</th>
                                                    <th>상담실</th>
                                                    <th>관리</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginateData(offlineCounsel).map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.number}</td>
                                                        <td>{item.date}</td>
                                                        <td>{item.time}</td>
                                                        <td>{item.room}</td>
                                                        <td>
                                                            <button
                                                                className="counsel-delete-btn"
                                                                onClick={() => handleOfflineDelete(item.id)}
                                                            >
                                                                취소
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {renderPagination(offlineCounsel.length)}
                                    </>
                                )}
                            </div>
                        )}
                    </section>
                </main>
            </div>
            <Footer />
        </div>

    );
};

export default Counsel;
