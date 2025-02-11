import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../MainPage/RecruitmentSidebar";
import "../write/SuggestWrite.css";
import { LoginContext } from "../../login/security/contexts/LoginContextProvider"; // ✅ 로그인 정보 가져오기

function SuggestWrite() {
  const navigate = useNavigate();
  const { isLoginId, isName } = useContext(LoginContext); // ✅ 현재 로그인한 사용자의 ID와 이름 가져오기
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]); // 파일 목록

  // 📌 제목 변경 핸들러
  const changeTitle = (event) => {
    setTitle(event.target.value);
  };

  // 📌 내용 변경 핸들러
  const changeContent = (event) => {
    setContent(event.target.value);
  };

  // 📌 파일 선택 핸들러
  const handleChangeFile = (event) => {
    const selectedFiles = Array.from(event.target.files).slice(0, 5);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  // 📌 파일 삭제 핸들러
  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // 📌 게시글 작성 API 호출
  const createBbs = async () => {
    const token = localStorage.getItem("accessToken"); // ✅ 최신 토큰 가져오기
    console.log("🛠️ 현재 accessToken:", token); // ✅ 콘솔에서 토큰 확인

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const req = {
      title: title,
      content: content,
      writer: isLoginId, // ✅ 작성자 ID 추가
    };

    try {
      const response = await axios.post("http://localhost:8090/api/board/admin/new", req, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 최신 토큰 설정
          "Content-Type": "application/json",
        },
        withCredentials: false, // ✅ 쿠키 인증 불필요하므로 false 설정
      });

      console.log("게시글 작성 성공:", response.data);
      alert("게시글이 성공적으로 등록되었습니다.");

      // 파일 업로드 실행 (게시글 ID 사용)
      if (files.length > 0) {
        await fileUpload(response.data.boardId);
      }

      navigate(`/bbsdetail/${response.data.boardId}`);
    } catch (error) {
      console.error("게시글 작성 중 오류 발생:", error);
      alert("게시글 작성에 실패했습니다.");
    }
  };

  // 📌 파일 업로드 API 호출
  const fileUpload = async (boardId) => {
    const token = localStorage.getItem("accessToken"); // ✅ accessToken 가져오기

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("boardImgFile", file));

    try {
      await axios.post(`http://localhost:8090/api/board/admin/upload/${boardId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 최신 토큰 설정
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("파일 업로드 성공");
    } catch (error) {
      console.error("파일 업로드 중 오류 발생:", error);
    }
  };

  // 📌 등록 버튼 클릭 시 실행
  const handleSubmit = () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const confirmSubmit = window.confirm("게시글을 등록하시겠습니까?");
    if (confirmSubmit) {
      createBbs();
    } else {
      alert("등록이 취소되었습니다.");
    }
  };

  return (
    <div>
      <div className="suggestWrite-d-flex">
        <Sidebar />
        <div className="suggestWrite-content-area">
          <table className="suggestWrite-table">
            <tbody>
              <tr>
                <th className="suggestWrite-table-primary">작성자</th>
                <td>
                  <input
                    type="text"
                    className="suggestWrite-form-control"
                    value={isName || "알 수 없음"} // ✅ 로그인된 사용자 이름으로 변경
                    size="50px"
                    readOnly
                  />
                </td>
              </tr>

              <tr>
                <th className="suggestWrite-table-primary">제목</th>
                <td>
                  <input
                    type="text"
                    className="suggestWrite-form-control"
                    value={title}
                    onChange={changeTitle}
                    size="50px"
                  />
                </td>
              </tr>

              <tr>
                <th className="suggestWrite-table-primary">내용</th>
                <td>
                  <textarea
                    className="suggestWrite-form-control"
                    value={content}
                    onChange={changeContent}
                    rows="10"
                  ></textarea>
                </td>
              </tr>

              <tr>
                <th className="suggestWrite-table-primary">파일 업로드</th>
                <td>
                  {files.map((file, index) => (
                    <div
                      key={index}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <p>
                        <strong>FileName:</strong> {file.name}
                      </p>
                      <button
                        className="suggestWrite-delete-button"
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                      >
                        x
                      </button>
                    </div>
                  ))}
                  {files.length < 5 && (
                    <div>
                      <input
                        type="file"
                        name="file"
                        onChange={handleChangeFile}
                        multiple="multiple"
                      />
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {/* 등록 버튼 */}
          <div className="suggestWrite-button-container">
            <button
              className="suggestWrite-btn-outline-secondary"
              onClick={handleSubmit}
            >
              <i className="fas fa-pen"></i> 등록하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuggestWrite;
