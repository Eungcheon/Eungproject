package com.example.hansei.board.common.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserResponse {
    private Long userId;
    private String userName;
    private String userRole;
    private String userEmail;
}
