package com.example.hansei.counsel.offline.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class MonthlyStatsScheduler {

    private final StatisticsService statisticsService;

    // 매월 1일 자정에 실행
    @Scheduled(cron = "0 0 0 1 * *") // 0초 0분 0시 1일 *월 *요일
    public void updateMonthlyStatsCache() {
    	statisticsService.updateMonthlyStatsCache();
        System.out.println("Monthly statistics cache updated.");
    }
}