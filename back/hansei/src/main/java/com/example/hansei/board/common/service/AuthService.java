package com.example.hansei.board.common.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.hansei.board.common.dto.UserResponse;
import com.example.hansei.board.common.entity.UserEntity;
import com.example.hansei.board.common.repository.UserRepository;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    public UserResponse authenticateUser(String email, String password) {    	
    	UserEntity user = userRepository.findByUserEmailAndUserPassword(email, password)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
    	
        UserResponse response = new UserResponse();
        response.setUserId(user.getUserId());
        response.setUserName(user.getUserName());
        response.setUserRole(user.getUserRole());
        response.setUserEmail(user.getUserEmail());
        
        return response;
    }
}
