package com.example.hansei.counsel.offline.service;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.hansei.counsel.offline.dto.MonthlyStatsDto;

@Service
public class MonthlyStatsScheduler {

    private final OfflineCounselService offlineCounselService;

    public MonthlyStatsScheduler(OfflineCounselService offlineCounselService) {
        this.offlineCounselService = offlineCounselService;
    }

    // 매월 1일 자정에 실행
    @Scheduled(cron = "0 0 0 1 * *") // 0초 0분 0시 1일 *월 *요일
    public void updateMonthlyStatsCache() {
        List<MonthlyStatsDto> stats = offlineCounselService.getMonthlyStats();
        // 캐싱 갱신 작업 처리 (캐시 저장 로직은 Service 계층에서 처리 가능)
        System.out.println("Monthly statistics cache updated: " + stats);
    }
}