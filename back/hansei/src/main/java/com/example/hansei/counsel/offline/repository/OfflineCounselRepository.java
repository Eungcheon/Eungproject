package com.example.hansei.counsel.offline.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hansei.counsel.offline.entity.OfflineCounsel;

public interface OfflineCounselRepository extends JpaRepository<OfflineCounsel, Long>{

	List<OfflineCounsel> findByCounselor(String counselor);
	
}
