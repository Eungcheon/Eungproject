package com.example.hansei.counsel.offline.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hansei.counsel.offline.dto.OfflineCounselDto;
import com.example.hansei.counsel.offline.service.OfflineCounselService;

@RestController
@RequestMapping("/api/counsel/schedule")
public class OfflineCounselController {

    private final OfflineCounselService offlineCounselService;

    public OfflineCounselController(OfflineCounselService offlineCounselService) {
        this.offlineCounselService = offlineCounselService;
    }

    // ✅ 일정 등록
    @PostMapping
    public ResponseEntity<String> createSchedule(@RequestBody OfflineCounselDto dto) {
        offlineCounselService.createSchedule(dto);
        return ResponseEntity.ok("일정이 등록되었습니다.");
    }

    // ✅ 본인의 일정 조회
    @GetMapping
    public List<OfflineCounselDto> getSchedules(@RequestParam String counselor) {
        return offlineCounselService.getSchedulesByCounselor(counselor);
    }

    // ✅ 일정 수정
    @PutMapping("/{id}")
    public ResponseEntity<String> updateSchedule(@PathVariable Long id, @RequestBody OfflineCounselDto dto) {
        offlineCounselService.updateSchedule(id, dto);
        return ResponseEntity.ok("일정이 수정되었습니다.");
    }

    // ✅ 일정 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSchedule(@PathVariable Long id, @RequestParam String counselor) {
        offlineCounselService.deleteSchedule(id, counselor);
        return ResponseEntity.ok("일정이 삭제되었습니다.");
    }
    
    @PatchMapping("/{id}/reserve")
    public ResponseEntity<String> reserveSchedule(@PathVariable Long id, @RequestBody String client) {
        offlineCounselService.reserveSchedule(id, client);
        return ResponseEntity.ok("일정이 예약되었습니다.");
    }
}

