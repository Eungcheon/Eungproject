package com.example.hansei.board.common.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LoginRequest {
    private String userEmail;
    private String userPassword;
}