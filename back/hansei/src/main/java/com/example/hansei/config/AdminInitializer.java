package com.example.hansei.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.example.hansei.constant.Gender;
import com.example.hansei.constant.Role;
import com.example.hansei.entity.HanUser;
import com.example.hansei.login.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByLoginid("admin").isEmpty()) { // 관리자가 없을 경우 추가
            HanUser admin = new HanUser();
            admin.setLoginid("admin"); // 기본 관리자 아이디
            admin.setPassword(passwordEncoder.encode("admin123")); // 기본 관리자 비밀번호
            admin.setRole(Role.ROLE_ADMIN); // ✅ Role Enum 사용 (ROLE_ADMIN)
            
            // 필수 정보 추가
            admin.setName("관리자");
            admin.setEmail("admin@example.com");
            admin.setPhone("010-1234-5678");
            admin.setGender(Gender.MALE); // 기본값 설정
            admin.setSms(true); // 문자 수신 동의
            admin.setDepart("관리부"); // 기본 학과 (필수 값)

            userRepository.save(admin);
            System.out.println("✅ 관리자 계정이 자동 생성되었습니다. (ID: admin / PW: admin123)");
        }
        
        if (userRepository.findByLoginid("user").isEmpty()) { // 유저가 없을 경우 추가
            HanUser user = new HanUser();
            user.setLoginid("user"); // 기본 유저 아이디
            user.setPassword(passwordEncoder.encode("user1234")); // 기본 유저 비밀번호
            user.setRole(Role.ROLE_USER); // ✅ Role Enum 사용 (ROLE_USER)
            
            // 필수 정보 추가
            user.setName("유저");
            user.setEmail("user@example.com");
            user.setPhone("010-1234-5679");
            user.setGender(Gender.MALE); // 기본값 설정
            user.setSms(true); // 문자 수신 동의
            user.setDepart("일반부"); // 기본 학과 (필수 값)

            userRepository.save(user);
            System.out.println("✅ 유저 계정이 자동 생성되었습니다. (ID: user / PW: user1234)");
        }
        
        if (userRepository.findByLoginid("user2").isEmpty()) { // 유저가 없을 경우 추가
            HanUser user = new HanUser();
            user.setLoginid("user2"); // 기본 유저 아이디
            user.setPassword(passwordEncoder.encode("user1234")); // 기본 유저 비밀번호
            user.setRole(Role.ROLE_USER); // ✅ Role Enum 사용 (ROLE_USER)
            
            // 필수 정보 추가
            user.setName("유저2");
            user.setEmail("user2@example.com");
            user.setPhone("010-1234-5679");
            user.setGender(Gender.MALE); // 기본값 설정
            user.setSms(false); // 문자 수신 동의
            user.setDepart("코딩부"); // 기본 학과 (필수 값)

            userRepository.save(user);
            System.out.println("✅ 유저 계정이 자동 생성되었습니다. (ID: user2 / PW: user1234)");
        }
    }
}
