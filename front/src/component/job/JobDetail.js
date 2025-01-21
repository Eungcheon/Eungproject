import React, { useState } from "react";
import "./styles/JobDetail.css";

const JobDetail = () => {
    const [isFavorited, setIsFavorited] = useState(false);
    const [favoriteCount, setFavoriteCount] = useState(0);

    const toggleFavorite = () => {
        setIsFavorited(!isFavorited);
        setFavoriteCount((prevCount) => (isFavorited ? prevCount - 1 : prevCount + 1));
    };

    return (
        <div className="container">
            {/* Header Section */}
            <div className="header">
                <div className="image-container">
                    <img src="file:///D:/html/images/image1.png" alt="프로그램 이미지" />
                </div>
                <div className="info-container">
                    <h1>프로그램 이름</h1>
                    <hr />
                    <div className="details">
                        <p><strong>모집대상:</strong> </p>
                        <p><strong>학년/성별:</strong> </p>
                        <p><strong>학과:</strong> </p>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="bottom-section">
                <div className="poster-info">
                    <p><strong>게시자 정보:</strong></p>
                    <p></p>
                    <p></p>
                </div>
                <div className="description">
                    <p>프로그램 상세 설명을 여기에 추가하세요. 이 영역은 스크롤이 가능합니다. 추가 설명 및 안내를 이곳에 추가하십시오.</p>
                </div>
            </div>

            {/* Apply and Favorite Buttons */}
            <div className="action-buttons">
                <button className="apply-button">신청하기</button>
                <div className="favorite-container" onClick={toggleFavorite}>
                    <span className={`favorite-icon ${isFavorited ? "active" : ""}`}>★</span>
                    <span className="favorite-count">{favoriteCount}</span>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;