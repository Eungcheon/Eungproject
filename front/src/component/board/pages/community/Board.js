/* (공용) 게시글 목록 페이지 */
import './css/Board.css';
import { useNavigate } from "react-router-dom";
import Pagination from "../common/Pagination";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../api/serverURL";
import useIsAdmin from "../../hooks/useIsAdmin";
import useSearch from '../../hooks/useSearch';


const Board = ({ type }) => {
    const boardTitles = {
        'notice': '공지사항',
        'archive': '자료실',
        'faq': '자주 묻는 질문'
    };

    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [sortOrder, setSortOrder] = useState('desc');
    const itemsPerPage = 10;

    const navigate = useNavigate();
    const isAdmin = useIsAdmin();
    const {
        searchType,
        searchKeyword,
        handleSearchChange,
        handleSearch,
        handleSearchTypeChange
    } = useSearch();

    useEffect(() => {
        fetchPosts();
    }, [currentPage, type, sortOrder]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/api/${type}`, {
                params: {
                    page: currentPage,
                    size: itemsPerPage,
                    sort: sortOrder,
                    searchType,
                    keyword: searchKeyword
                }
            });
            setPosts(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleSearchSubmit = useCallback(() => {
        setCurrentPage(0);
        fetchPosts();
    }, [setCurrentPage, fetchPosts]);

    const handlePageChange = (page) => {
        setCurrentPage(page - 1);
        // 페이지 변경 시 데이터 fetch 로직
    };

    const handlePostClick = (postId) => {
        navigate(`/community/${type}/detail/${postId}`);
    };

    // 글쓰기 페이지 이동
    const handleWriteClick = () => {
        navigate(`/community/${type}/write`);
    };

    return (
        <div className="boardContainer">
            <p>{boardTitles[type]}</p>
            <div className="boardTopBox">
                <div className="selectSortOrder">
                    <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
                        <option value="desc">최신순</option>
                        <option value="asc">오래된순</option>
                    </select>
                </div>
                <div className="searchBox">
                    <select
                        value={searchType}
                        onChange={handleSearchTypeChange}
                    >
                        <option value="title">제목</option>
                        <option value="author">이름</option>
                    </select>
                    <input
                        type="text"
                        placeholder="검색어를 입력하세요"
                        value={searchKeyword}
                        onChange={handleSearchChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch(handleSearchSubmit);
                            }
                        }}
                    />
                    <button onClick={() => handleSearch(handleSearchSubmit)}>입력</button>
                </div>
                {isAdmin && <button onClick={handleWriteClick}>글쓰기</button>}
            </div>
            <div className="boardMiddleBox">
                <table className="boardTable">
                    <colgroup>
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "50%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "20%" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>작성일자</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post, index) => (
                            <tr key={post.id} >
                                <td>{sortOrder === 'desc'
                                    ? totalElements - (currentPage * itemsPerPage) - index
                                    : (currentPage * itemsPerPage) + index + 1
                                }</td>
                                <td>
                                    <span className='boardTitle'
                                        onClick={() => handlePostClick(post.id)}>
                                        {post.title}
                                    </span>
                                </td>
                                <td>{post.author}</td>
                                <td>{post.createdDate.split('T')[0]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={currentPage + 1}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default Board;