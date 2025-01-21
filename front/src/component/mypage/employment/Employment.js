import React, { useState } from 'react';
import './Employment.css';
import Footer from '../page/Footer';
import Header from '../page/Header';
import Sidebar from '../page/Sidebar';

const Employment = () => {
    const [activeTab, setActiveTab] = useState("tab1");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // 한 페이지에 표시할 데이터 수

    const [jobData, setJobData] = useState({
        tab1: [
            { id: 1, company: "CJ", details: "4300만원 / 한국 / 주 40시간", education: "관계없음", registered: "2024-04-25", deadline: "2024-05-06", isFavorite: false },
            { id: 2, company: "풀무원", details: "3890만원 / 한국 / 주 40시간", education: "전문대 졸업(예정자)", registered: "2024-04-19", deadline: "2024-04-28", isFavorite: false },
            { id: 3, company: "풀무원", details: "3890만원 / 한국 / 주 40시간", education: "전문대 졸업(예정자)", registered: "2024-04-19", deadline: "2024-04-28", isFavorite: false },
            { id: 4, company: "풀무원", details: "3890만원 / 한국 / 주 40시간", education: "전문대 졸업(예정자)", registered: "2024-04-19", deadline: "2024-04-28", isFavorite: false },
            { id: 5, company: "풀무원", details: "3890만원 / 한국 / 주 40시간", education: "전문대 졸업(예정자)", registered: "2024-04-19", deadline: "2024-04-28", isFavorite: false },
            { id: 6, company: "풀무원", details: "3890만원 / 한국 / 주 40시간", education: "전문대 졸업(예정자)", registered: "2024-04-19", deadline: "2024-04-28", isFavorite: false },
            { id: 7, company: "풀무원", details: "3890만원 / 한국 / 주 40시간", education: "전문대 졸업(예정자)", registered: "2024-04-19", deadline: "2024-04-28", isFavorite: false },
            { id: 8, company: "풀무원", details: "3890만원 / 한국 / 주 40시간", education: "전문대 졸업(예정자)", registered: "2024-04-19", deadline: "2024-04-28", isFavorite: false },
            { id: 9, company: "풀무원", details: "3890만원 / 한국 / 주 40시간", education: "전문대 졸업(예정자)", registered: "2024-04-19", deadline: "2024-04-28", isFavorite: false },
            { id: 10, company: "풀무원", details: "3890만원 / 한국 / 주 40시간", education: "전문대 졸업(예정자)", registered: "2024-04-19", deadline: "2024-04-28", isFavorite: false },
            { id: 11, company: "풀무원", details: "3890만원 / 한국 / 주 40시간", education: "전문대 졸업(예정자)", registered: "2024-04-19", deadline: "2024-04-28", isFavorite: false },
            { id: 12, company: "풀무원", details: "3890만원 / 한국 / 주 40시간", education: "전문대 졸업(예정자)", registered: "2024-04-19", deadline: "2024-04-28", isFavorite: false },

        ],
        tab2: [
            { id: 3, company: "네이버", details: "연봉 협의 / 서울 / 주 40시간", education: "학사 이상", registered: "2024-04-15", deadline: "2024-04-30", isFavorite: false },
            { id: 4, company: "카카오", details: "연봉 협의 / 성남 / 주 40시간", education: "학사 이상", registered: "2024-04-10", deadline: "2024-04-25", isFavorite: false },
        ],
        tab3: [
            { id: 5, company: "CJ", details: "4300만원 / 한국 / 주 40시간", education: "관계없음", registered: "2024-04-25", deadline: "2024-05-06", isFavorite: false },
            { id: 6, company: "풀무원", details: "3890만원 / 한국 / 주 40시간", education: "전문대 졸업(예정자)", registered: "2024-04-19", deadline: "2024-04-28", isFavorite: false },
        ],
        tab4: [],
    });

    const toggleFavorite = (tab, jobId) => {
        setJobData((prevJobData) => {
            const updatedTabData = prevJobData[tab].filter((job) => job.id !== jobId);
            const totalItems = updatedTabData.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);

            if (currentPage > totalPages) {
                setCurrentPage(totalPages > 0 ? totalPages : 1);
            }

            return { ...prevJobData, [tab]: updatedTabData };
        });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginateData = (data) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage).map((job, index) => ({
            ...job,
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

    const emptyMessages = {
        tab1: "즐겨찾기한 교내 채용 정보가 없습니다.",
        tab2: "즐겨찾기한 추천 채용 정보가 없습니다.",
        tab3: "즐겨찾기한 교외 채용 정보가 없습니다.",
        tab4: "즐겨찾기한 인턴 채용 정보가 없습니다.",
    };

    return (
        <div>
            <Header />
            <div className="container">
                <main>
                    <Sidebar />
                    <section className="form-container">
                        <h2>나의 채용 정보</h2>
                        <ul className="employment-tabs">
                            <li
                                className={`employment-tab ${activeTab === "tab1" ? "active" : ""}`}
                                onClick={() => setActiveTab("tab1")}
                            >
                                교내 채용
                            </li>
                            <li
                                className={`employment-tab ${activeTab === "tab2" ? "active" : ""}`}
                                onClick={() => setActiveTab("tab2")}
                            >
                                추천 채용
                            </li>
                            <li
                                className={`employment-tab ${activeTab === "tab3" ? "active" : ""}`}
                                onClick={() => setActiveTab("tab3")}
                            >
                                교외 채용
                            </li>
                            <li
                                className={`employment-tab ${activeTab === "tab4" ? "active" : ""}`}
                                onClick={() => setActiveTab("tab4")}
                            >
                                인턴 채용
                            </li>
                        </ul>
                        <div className="tab-content">
                            {jobData[activeTab]?.length > 0 ? (
                                <>
                                    <table className="employment-table">
                                        <thead>
                                            <tr>
                                                <th>즐겨찾기</th>
                                                <th>회사명</th>
                                                <th>채용 정보</th>
                                                <th>학력 / 경력</th>
                                                <th>등록일</th>
                                                <th>마감일</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginateData(jobData[activeTab]).map((job) => (
                                                <tr key={job.id}>
                                                    <td>
                                                        <span
                                                            className="star"
                                                            onClick={() => toggleFavorite(activeTab, job.id)}
                                                        >
                                                            ★
                                                        </span>
                                                    </td>
                                                    <td>{job.company}</td>
                                                    <td>{job.details}</td>
                                                    <td>{job.education}</td>
                                                    <td>{job.registered}</td>
                                                    <td>{job.deadline}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {renderPagination(jobData[activeTab].length)}
                                </>
                            ) : (
                                <p className="empty-message">{emptyMessages[activeTab]}</p>
                            )}
                        </div>
                    </section>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Employment;
