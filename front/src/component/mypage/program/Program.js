import React, { useState } from 'react';
import './Program.css';
import Footer from '../page/Footer';
import Header from '../page/Header';
import Sidebar from '../page/Sidebar';

const Program = () => {
    const [activeTab, setActiveTab] = useState("tab1");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // 한 페이지에 표시할 데이터 수

    const [programData, setProgramData] = useState({
        tab1: [
            { id: 1, name: "프로그램 A", details: "A하기", date: "2025-01-01", deadline: "2025-01-10", capacity: 30 },
            { id: 2, name: "프로그램 B", details: "B하기", date: "2025-01-02", deadline: "2025-01-12", capacity: 20 },
            { id: 3, name: "프로그램 C", details: "C하기", date: "2025-01-03", deadline: "2025-01-15", capacity: 25 },
            { id: 4, name: "프로그램 D", details: "D하기", date: "2025-01-04", deadline: "2025-01-16", capacity: 15 },
            { id: 5, name: "프로그램 E", details: "E하기", date: "2025-01-05", deadline: "2025-01-17", capacity: 10 },
            { id: 6, name: "프로그램 F", details: "F하기", date: "2025-01-06", deadline: "2025-01-18", capacity: 20 },
            { id: 7, name: "프로그램 G", details: "G하기", date: "2025-01-07", deadline: "2025-01-19", capacity: 25 },
            { id: 8, name: "프로그램 H", details: "H하기", date: "2025-01-08", deadline: "2025-01-20", capacity: 30 },
            { id: 9, name: "프로그램 I", details: "I하기", date: "2025-01-09", deadline: "2025-01-21", capacity: 20 },
            { id: 10, name: "프로그램 J", details: "J하기", date: "2025-01-10", deadline: "2025-01-22", capacity: 15 },
            { id: 11, name: "프로그램 K", details: "K하기", date: "2025-01-11", deadline: "2025-01-23", capacity: 10 },
        ],
        tab2: [
            { id: 12, name: "프로그램 L", details: "L하기", date: "2025-01-12", deadline: "2025-01-24", capacity: 30 },
        ],
    });

    const toggleFavorite = (tab, programId) => {
        setProgramData((prevProgramData) => {
            const updatedTabData = prevProgramData[tab].filter((program) => program.id !== programId);
            const totalItems = updatedTabData.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);

            if (currentPage > totalPages) {
                setCurrentPage(totalPages > 0 ? totalPages : 1);
            }

            return { ...prevProgramData, [tab]: updatedTabData };
        });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginateData = (data) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage).map((program, index) => ({
            ...program,
            number: startIndex + index + 1,
        }));
    };

    const renderPagination = (dataLength) => {
        const totalPages = Math.ceil(dataLength / itemsPerPage);
        if (totalPages <= 1) return null; // 한 페이지만 필요하면 표시하지 않음

        return (
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <span
                        key={index + 1}
                        className={`page-number ${currentPage === index + 1 ? "active" : ""}`}
                        onClick={() => handlePageChange(index + 1)}
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
            <div className="program-container">
                <main className="program-main">
                    <Sidebar />
                    <section className="program-form-container">
                        <h2>나의 취업 프로그램</h2>
                        <div className="jb-division-line"></div>
                        {/* 탭 메뉴 */}
                        <ul className="program-tabs">
                            <li
                                className={`program-tab ${activeTab === "tab1" ? "active" : ""}`}
                                onClick={() => setActiveTab("tab1")}
                            >
                                신청한 프로그램
                            </li>
                            <li
                                className={`program-tab ${activeTab === "tab2" ? "active" : ""}`}
                                onClick={() => setActiveTab("tab2")}
                            >
                                즐겨찾기한 프로그램
                            </li>
                        </ul>
                        {/* 탭 콘텐츠 */}
                        {activeTab === "tab1" && (
                            <div className="program-tab-content">
                                {programData.tab1.length > 0 ? (
                                    <>
                                        <table className="program-table">
                                            <thead>
                                                <tr>
                                                    <th>번호</th>
                                                    <th>프로그램명</th>
                                                    <th>프로그램 내용</th>
                                                    <th>날짜</th>
                                                    <th>신청 마감일</th>
                                                    <th>정원</th>
                                                    <th>관리</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginateData(programData.tab1).map((program) => (
                                                    <tr key={program.id}>
                                                        <td>{program.number}</td>
                                                        <td>{program.name}</td>
                                                        <td>{program.details}</td>
                                                        <td>{program.date}</td>
                                                        <td>{program.deadline}</td>
                                                        <td>{program.capacity}명</td>
                                                        <td>
                                                            <button
                                                                className="program-delete-btn"
                                                                onClick={() => toggleFavorite("tab1", program.id)}
                                                            >
                                                                삭제
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {renderPagination(programData.tab1.length)}
                                    </>
                                ) : (
                                    <p className="empty-message">신청한 나의 채용 프로그램이 여기에 표시됩니다.</p>
                                )}
                            </div>
                        )}
                        {activeTab === "tab2" && (
                            <div className="program-tab-content">
                                {programData.tab2.length > 0 ? (
                                    <>
                                        <table className="program-table">
                                            <thead>
                                                <tr>
                                                    <th>번호</th>
                                                    <th>즐겨찾기</th>
                                                    <th>프로그램명</th>
                                                    <th>프로그램 내용</th>
                                                    <th>등록일</th>
                                                    <th>마감일</th>
                                                    <th>정원</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginateData(programData.tab2).map((program) => (
                                                    <tr key={program.id}>
                                                        <td>{program.number}</td>
                                                        <td>
                                                            <span
                                                                className="program-star"
                                                                onClick={() => toggleFavorite("tab2", program.id)}
                                                            >
                                                                ★
                                                            </span>
                                                        </td>
                                                        <td>{program.name}</td>
                                                        <td>{program.details}</td>
                                                        <td>{program.date}</td>
                                                        <td>{program.deadline}</td>
                                                        <td>{program.capacity}명</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {renderPagination(programData.tab2.length)}
                                    </>
                                ) : (
                                    <p className="empty-message">즐겨찾기한 나의 추천 프로그램이 여기에 표시됩니다.</p>
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

export default Program;
