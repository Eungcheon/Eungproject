package com.example.hansei.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // CSRF 보호 비활성화 (API 요청을 위해 개발 중일 때)
            .cors(Customizer.withDefaults()) // CORS 설정 활성화
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // CORS preflight 요청 허용
                .requestMatchers("/api/**").permitAll() // API 경로에 대한 요청 허용
                .requestMatchers(HttpMethod.DELETE, "/api/files/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/files/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/files/**").permitAll()
                .anyRequest().authenticated() // 다른 모든 요청은 인증 필요
           
            );
        return http.build();
    }
}

