package com.example.hansei.board.common.service;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.hansei.board.common.entity.Post;
import com.example.hansei.board.common.entity.PostFile;
import com.example.hansei.board.common.repository.FileRepository;
import com.example.hansei.board.common.repository.PostRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class FileService {
    
    @Value("${file.upload.path}")
    private String uploadPath;
    
    @Autowired
    private FileRepository fileRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    // 파일 업로드
    public List<PostFile> saveFiles(List<MultipartFile> files) {
        List<PostFile> savedFiles = new ArrayList<>();
        
        for (MultipartFile multipartFile : files) {
            if (!multipartFile.isEmpty()) {
                try {
                	// 원본 파일명 (디코딩)
                    String originalFilename = URLDecoder.decode(multipartFile.getOriginalFilename(), StandardCharsets.UTF_8.toString());
                    
                    // UUID 생성
                    String uuid = UUID.randomUUID().toString();
                    
                    // 파일 확장자 추출
                    String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    
                    // 저장할 파일명 생성 (UUID + 확장자)
                    String storedFileName = uuid + extension;
                    
                    // 파일 저장 경로 생성
                    String filePath = uploadPath + storedFileName;
                    
                    // 파일 저장
                    multipartFile.transferTo(new File(filePath));
                    
                    // 파일 정보 생성
                    PostFile file = new PostFile();
                    
                    file.setName(originalFilename);
                    file.setStoredName(storedFileName);
                    file.setUrl("/files/" + URLEncoder.encode(storedFileName, StandardCharsets.UTF_8.toString()));
                    file.setContentType(multipartFile.getContentType());
                    file.setSize(multipartFile.getSize());
                    
                    savedFiles.add(file);
                    
                } catch (IOException e) {
                    throw new RuntimeException("Failed to save file", e);
                }
            }
        }
        
        return savedFiles;
    }
    
    
    public void deleteFile(Long fileId) {
        try {
            // 1. DB에서 파일 정보 조회
            PostFile postFile = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
                
            // 2. 실제 파일 삭제
            File fileToDelete = new File(uploadPath + postFile.getStoredName());
            if (fileToDelete.exists()) {
                if (!fileToDelete.delete()) {
                    throw new RuntimeException("Physical file deletion failed");
                }
            }

            // 3. Post 엔티티에서 파일 제거
            // post_attachments 테이블의 데이터도 자동으로 삭제됨
            Post post = postRepository.findByAttachmentsContaining(postFile)
                .orElse(null);
            if (post != null) {
                post.getAttachments().remove(postFile);
                postRepository.save(post);
            }
            
            // 4. PostFile 엔티티 삭제
            fileRepository.delete(postFile);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file: " + e.getMessage(), e);
        }
    }
}

