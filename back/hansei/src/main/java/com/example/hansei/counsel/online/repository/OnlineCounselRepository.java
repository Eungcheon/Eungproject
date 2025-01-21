package com.example.hansei.counsel.online.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hansei.counsel.online.entity.OnlineCounsel;

public interface OnlineCounselRepository extends JpaRepository<OnlineCounsel, Long>{
	
	Page<OnlineCounsel> findAll(Pageable pageable);

}
