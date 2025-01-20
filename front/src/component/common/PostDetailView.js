/* (공용) 글 상세 페이지 */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../../api/serverURL";
import useFileDownload from "../../hooks/useFileDownload";
import useIsAdmin from "../../hooks/useIsAdmin";

const PostDetailView = () => {
    const { handleFileDownload } = useFileDownload();
    const isAdmin = useIsAdmin();

    const { type, id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/api/${type}/${id}`);
                console.log('Post detail response:', response.data);
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching post detail:', error);
            }
        };

        fetchPostDetail();
    }, [id, type]);

    return (
        <div className="detailBoardContainer">
            <table>
                <tbody>
                    <tr>
                        <th>제목</th>
                        <td>{post?.title}</td>
                    </tr>
                    <tr>
                        <th>작성자</th>
                        <td>{post?.author}</td>
                    </tr>
                    <tr>
                        <th>작성일자</th>
                        <td>{post?.createdDate.replace('T', ' ')}</td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td>{post?.content}</td>
                    </tr>
                    <tr>
                    <th>첨부파일</th>
                        <td>
                            {post?.fileList?.map(file => (
                                <div key={file.id}>
                                    <span
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleFileDownload(file.url, file.name);
                                        }}
                                    >
                                        {file.name}
                                    </span>
                                </div>
                            ))}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="buttonContainer">
                {isAdmin && <button onClick={() => navigate(`/community/${type}/edit/${id}`)}>수정</button>}
                <button onClick={() => navigate(`/community/${type}`)}>목록</button>
            </div>
        </div>
    );
};

export default PostDetailView;
