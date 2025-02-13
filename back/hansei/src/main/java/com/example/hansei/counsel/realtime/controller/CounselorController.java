package com.example.hansei.counsel.realtime.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/counselors")
public class CounselorController {

	@Autowired
    private CounselorRepository counselorRepository;

    @GetMapping
    public List<Counselor> getAllCounselors() {
        return counselorRepository.findAll();
    }
}
