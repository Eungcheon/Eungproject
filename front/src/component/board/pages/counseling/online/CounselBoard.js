import '../../common/css/Board.css';
import { useNavigate } from "react-router-dom";
import Pagination from "../../common/Pagination";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../api/serverURL";
import useIsAdmin from "../../../hooks/useIsAdmin";
import useSearch from '../../../hooks/useSearch';
import SearchBox from '../../common/SearchBox';

const CounselBoard = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [sortOrder, setSortOrder] = useState('desc');

    const itemsPerPage = 10;

    const {
        searchType,
        searchKeyword,
        handleSearch,
        handleSearchTypeChange
    } = useSearch();
    const navigate = useNavigate();
    const isAdmin = useIsAdmin();

    useEffect(() => {
        fetchPosts();
    }, [currentPage, sortOrder]);

    const fetchPosts = useCallback(async () => {
        try {
            const response = await axios.get(`${SERVER_URL}/api/counsel`, {
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
            console.error('Error fetching counsels:', error);
        }
    }, [currentPage, sortOrder, searchType, searchKeyword]);

    const handleSearchSubmit = useCallback(() => {
        setCurrentPage(0);
        fetchPosts();
    }, [setCurrentPage, fetchPosts]);

    const handlePageChange = (page) => {
        setCurrentPage(page - 1);
    };

    const handlePostClick = (post) => {
        // 현재 로그인한 사용자 정보 가져오기
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        // 관리자이거나 작성자인 경우에만 접근 가능
        if (isAdmin || post.author === userInfo?.userName) {
            navigate(`/counsel/online/detail/${post.id}`);
        } else {
            alert('작성자만 열람할 수 있습니다.');
        }
    };

    const handleWriteClick = () => {
        navigate(`/counsel/online/write`);
    };

    return (
        <div className="common-board-container">
            <h1>온라인 상담</h1>
            <p>게시판 사용 안내</p>
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
                <button onClick={handleWriteClick}>글쓰기</button>
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
                            <tr key={post.id}>
                                <td>
                                    {sortOrder === 'desc'
                                        ? totalElements - (currentPage * itemsPerPage) - index
                                        : (currentPage * itemsPerPage) + index + 1
                                    }
                                </td>
                                <td>
                                    <span className='common-board-title'
                                        onClick={() => handlePostClick(post)}>
                                        {post.title}
                                    </span>
                                    {post.answer && <span className="board-answered"
                                        onClick={() => handlePostClick(post)}>
                                        [답변완료]
                                    </span>}
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

export default CounselBoard;
