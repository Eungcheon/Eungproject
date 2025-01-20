import './css/PostWriteForm.css';
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_URL } from "../../api/serverURL";
import useFileUpload from "../../hooks/useFileUpload";

const PostWriteForm = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [createdDate, setCreatedDate] = useState('');

    const {
        existingFiles,
        fileNames,
        setInitialFiles,
        handleFileSelect,
        handleRemoveFile,
        handleRemoveExistingFile,
        appendFilesToFormData
    } = useFileUpload();

    const isEdit = !!id; // id가 있으면 수정 모드

    // 수정 모드일 경우 기존 데이터 불러오기
    useEffect(() => {
        if (isEdit) {
            const fetchPost = async () => {
                try {
                    const response = await axios.get(`${SERVER_URL}/api/${type}/${id}`);
                    const post = response.data;
                    setTitle(post.title);
                    setContent(post.content);
                    setAuthor(post.author);
                    setCreatedDate(post.createdDate);
                    setInitialFiles(post.fileList);

                } catch (error) {
                    console.error('Error fetching post:', error);
                }
            };
            fetchPost();
        } else {
            // 새 글 작성 모드일 때는 현재 사용자 정보만 설정
            const fetchUserInfo = async () => {
                try {
                    // const response = await axios.get(`${SERVER_URL}/api/user/info`);
                    // setAuthor(response.data.name);
                    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                    if (userInfo) {
                        setAuthor(userInfo.userName);
                    }
                } catch (error) {
                    console.error('Error fetching user info:', error);
                }
            };
            fetchUserInfo();
        }
    }, [isEdit, type, id]);

    // 글 저장/수정 처리
    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('author', author);
        formData.append('createdDate', createdDate);
        appendFilesToFormData(formData);

        try {
            if (isEdit) {
                await axios.put(`${SERVER_URL}/api/${type}/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post(`${SERVER_URL}/api/${type}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate(`/community/${type}`);
        } catch (error) {
            console.error('Error saving post:', error);
        }
    };

    // 글 삭제 처리
    const handleDelete = async () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await axios.delete(`${SERVER_URL}/api/${type}/${id}`);
                navigate(`/community/${type}`);
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    return (
        <div className="writeBoardContainer">
            <table>
                <tbody>
                    <tr>
                        <th>제목</th>
                        <td>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>첨부파일</th>
                        <td>
                            {/* 기존 첨부파일 목록 */}
                            {isEdit && existingFiles.map(file => (
                                <div key={file.id} className="selectedFiles">
                                    {file.name}
                                    <button onClick={() => handleRemoveExistingFile(file.id)}>
                                        ×
                                    </button>
                                </div>
                            ))}
                            {/* 선택된 파일 목록 표시 */}
                            {fileNames.map((name, index) => (
                                <div key={index} className="selectedFiles">
                                    {name}
                                    <button
                                        onClick={() => handleRemoveFile(index)}
                                        className="removeFile"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <input
                                type="file"
                                onChange={handleFileSelect}
                                multiple
                                style={{ color: 'transparent' }}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="buttonContainer">
                <button onClick={handleSubmit}>
                    {isEdit ? '수정' : '저장'}
                </button>
                {isEdit && <button onClick={handleDelete}>삭제</button>}
                <button onClick={() => navigate(`/community/${type}`)}>목록</button>
            </div>
        </div>
    );
};


export default PostWriteForm;
