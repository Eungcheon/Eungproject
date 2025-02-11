import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "./Board.css";

function BoardDetail() {
    const { boardId } = useParams(); // URL에서 boardId 가져오기
    const navigate = useNavigate();
    const [board, setBoard] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ 게시글 상세 조회
    useEffect(() => {
        const fetchBoardDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/api/board/${boardId}`);
                console.log("📌 API 응답 데이터:", response.data); // ✅ API 응답 확인
                setBoard(response.data);
                setLoading(false);
            } catch (error) {
                console.error('게시글 불러오기 오류:', error);
                alert('게시글을 불러오는 중 오류가 발생했습니다.');
                navigate('/board');
            }
        };
        fetchBoardDetail();
    }, [boardId, navigate]);



    if (loading) return <div className="loading">로딩 중...</div>;

    return (
        <div className="board-detail-container">
            <h2 className="board-title">{board.title}</h2>
            <div className="board-info">
                <span className="board-writer">작성자: {board.writerName}</span>
                <span className="board-date">작성일: {board.updateTime?.split('T')[0]}</span>
                <span className="board-count">조회수: {board.count}</span>
            </div>
            <div className="board-content">{board.content}</div>

            {/* 첨부 이미지 표시 */}
            {/* 이미지 가운데 정렬을 위해 컨테이너 추가 */}
            {board.boardImgs && board.boardImgs.length > 0 ? (
                <div className="board-images-container">
                    {board.boardImgs.map((img) => {
                        const imageUrl = img.imgUrl.startsWith("http") ? img.imgUrl : `http://localhost:8090${img.imgUrl}`;
                        return (
                            <img key={img.id} src={imageUrl} alt="첨부 이미지" className="board-img" />
                        );
                    })}
                </div>
            ) : (
                <p className="no-image">첨부된 이미지가 없습니다.</p>
            )}



            <div className="board-buttons">
                <button className="btn-back" onClick={() => navigate('/board')}>목록으로</button>
            </div>
        </div>
    );
}

export default BoardDetail;
