import '../../../component/common/css/Board.css';
import { useNavigate } from "react-router-dom";
import Pagination from "../../../component/common/Pagination";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../api/serverURL";
import useIsAdmin from "../../../hooks/useIsAdmin";
import useSearch from '../../../hooks/useSearch';

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
        handleSearchChange,
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
        <div className="boardContainer">
            <p>온라인 상담</p>
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
                <button onClick={handleWriteClick}>글쓰기</button>
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
                            <tr key={post.id}>
                                <td>
                                    {sortOrder === 'desc'
                                        ? totalElements - (currentPage * itemsPerPage) - index
                                        : (currentPage * itemsPerPage) + index + 1
                                    }
                                </td>
                                <td>
                                    <span className='boardTitle'
                                        onClick={() => handlePostClick(post)}>
                                        {post.title}
                                    </span>
                                    {post.answer && <span className="answered"
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
