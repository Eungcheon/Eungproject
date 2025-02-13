package com.example.hansei.counsel.offline.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MonthlyStatsDto {
    private String month;  // "YYYY-MM" 형식
    private int count;     // 예약된 상담 횟수
}
