import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import Comment from "./Comment.js";
import "../../recruitment/css/commentList.css"; // 스타일 파일 import

function CommentList(props) {
	const boardId = props.boardId;

	// Paging
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);
	const [totalPages, setTotalPages] = useState(5);
	const [totalCnt, setTotalCnt] = useState(0);
	const [commentList, setCommentList] = useState([]);

	// comment에서 참조
	const getCommentListRef = useRef(null);

	const changePage = (newPage) => {
		setPage(newPage);
		getCommentList(newPage);
		getCommentListRef.current(newPage);
	};

	const getCommentList = async (page) => {
		await axios.get(`http://localhost:8989/board/${boardId}/comment/list`, { params: { "page": page - 1 } })
			.then((resp) => {
				console.log("[BbsComment.js] getCommentList() success :D");
				console.log(resp.data);

				setPageSize(resp.data.pageSize);
				setTotalPages(resp.data.totalPages);
				setTotalCnt(resp.data.totalElements);
				setCommentList(resp.data.content);
			}).catch((err) => {
				console.log("[BbsComment.js] getCommentList() error :<");
				console.log(err);
			});
	};

	useEffect(() => {
		getCommentListRef.current = getCommentList;
		getCommentList(1);
	}, [boardId]);

	const renderPagination = () => {
		const pageNumbers = [];
		for (let i = 1; i <= totalPages; i++) {
			pageNumbers.push(
				<button
					key={i}
					onClick={() => changePage(i)}
					className={`page-button ${page === i ? 'active' : ''}`}
				>
					{i}
				</button>
			);
		}
		return <div className="pagination">{pageNumbers}</div>;
	};

	return (
		<>
			<div className="my-1 d-flex justify-content-center">
			</div>

			{renderPagination()}

			{
				commentList.map((comment, idx) => (
					<div className="my-5" key={idx}>
						<Comment obj={comment} key={idx} page={page} getCommentList={getCommentListRef.current} />
					</div>
				))
			}
		</>
	);
}

export default CommentList;
