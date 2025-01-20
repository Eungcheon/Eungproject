import { useState } from "react";
import { SERVER_URL } from "../api/serverURL";
import axios from "axios";

const useFileUpload = () => {
    const [attachments, setAttachments] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    
    // 기존 파일 목록 설정
    const setInitialFiles = (files) => {
        setExistingFiles(files || []);
    };

    // 파일 선택 처리
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setAttachments(files);
        setFileNames(files.map(file => file.name));
    };

    // 선택된 파일 삭제 처리
    const handleRemoveFile = (index) => {
        const newAttachments = [...attachments];
        const newFileNames = [...fileNames];

        newAttachments.splice(index, 1);
        newFileNames.splice(index, 1);

        setAttachments(newAttachments);
        setFileNames(newFileNames);
    };

    // 기존 파일 삭제 처리
    const handleRemoveExistingFile = async (fileId) => {
        try {
            await axios.delete(`${SERVER_URL}/api/files/${fileId}`);
            setExistingFiles(existingFiles.filter(file => file.id !== fileId));
        } catch (error) {
            console.error('Error removing existing file:', error);
        }
    };

    // FormData에 파일 추가
    const appendFilesToFormData = (formData) => {
        for (let i = 0; i < attachments.length; i++) {
            formData.append('attachments', attachments[i]);
        }
    };

    return {
        attachments,
        fileNames,
        existingFiles,
        handleFileSelect,
        handleRemoveFile,
        handleRemoveExistingFile,
        setInitialFiles,
        appendFilesToFormData
    };
};

export default useFileUpload;