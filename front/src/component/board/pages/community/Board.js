/* (공용) 게시글 목록 페이지 */
import '../common/css/Board.css';
import { useNavigate } from "react-router-dom";
import Pagination from "../common/Pagination";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../api/serverURL";
import useIsAdmin from "../../hooks/useIsAdmin";
import useSearch from '../../hooks/useSearch';
import SearchBox from '../common/SearchBox';


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
        <div className="common-board-container">
            <h1>{boardTitles[type]}</h1>
            <div className="board-top-box">
                <div className="select-sort-order">
                    <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
                        <option value="desc">최신순</option>
                        <option value="asc">오래된순</option>
                    </select>
                </div>
                <SearchBox
                    searchType={searchType}
                    handleSearchTypeChange={handleSearchTypeChange}
                    handleSearch={handleSearch}
                    handleSearchSubmit={handleSearchSubmit}
                />
                {isAdmin && <button onClick={handleWriteClick}>글쓰기</button>}
            </div>
            <div className="board-middle-box">
                <table className="common-board-table">
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
                                    <span className='common-board-title'
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