import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";

function AdminPage() {
  const [newProgram, setNewProgram] = useState({
    name: "",
    startDate: "",
    endDate: "",
    maxParticipants: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(""); // 이미지 미리보기 URL 상태 추가
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: "ws://localhost:8090/ws",
      onConnect: () => {
        console.log("WebSocket 연결 성공");
        setIsConnected(true);
      },
      onStompError: (frame) => {
        console.error("WebSocket STOMP 오류:", frame.headers["message"]);
      },
      onDisconnect: () => {
        console.log("WebSocket 연결 종료");
        setIsConnected(false);
      },
    });
    stompClient.activate();
    setClient(stompClient);

    return () => stompClient.deactivate();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    // 이미지 미리보기 URL 설정
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview("");
    }
  };

  const handleAddProgram = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newProgram.name);
    formData.append("startDate", newProgram.startDate);
    formData.append("endDate", newProgram.endDate);
    formData.append("maxParticipants", newProgram.maxParticipants);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch("http://localhost:8090/api/programs", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const savedProgram = await response.json();

        if (client) {
          client.publish({
            destination: "/topic/programs",
            body: JSON.stringify(savedProgram),
          });
          console.log("WebSocket 메시지 전송:", savedProgram);
        }

        alert("프로그램이 성공적으로 추가되었습니다.");
        navigate("/");
        setNewProgram({
          name: "",
          startDate: "",
          endDate: "",
          maxParticipants: "",
        });
        setImageFile(null);
        setImagePreview(""); // 이미지 미리보기 초기화
      } else {
        alert("프로그램 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error adding program:", error);
    }
  };

  return (
    <div>
      <h2>관리자 페이지</h2>

      <div className="add-program-form">
        
        <form onSubmit={handleAddProgram}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              프로그램 이름
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={newProgram.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">
              시작 날짜
            </label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              name="startDate"
              value={newProgram.startDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">
              종료 날짜
            </label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              name="endDate"
              value={newProgram.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="maxParticipants" className="form-label">
              최대 신청자
            </label>
            <input
              type="number"
              className="form-control"
              id="maxParticipants"
              name="maxParticipants"
              value={newProgram.maxParticipants}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              이미지 업로드
            </label>
            <input
              type="file"
              className="form-control"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
            />
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="미리보기"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            프로그램 추가
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPage;