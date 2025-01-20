package com.example.hansei.board.common.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hansei.board.common.entity.Post;
import com.example.hansei.board.common.entity.PostFile;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByType(String type, Pageable pageable);
    Optional<Post> findByTypeAndId(String type, Long id);
    Optional<Post> findByAttachmentsContaining(PostFile postFile);
}

