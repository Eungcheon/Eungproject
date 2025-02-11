package com.example.hansei.entity;

import com.example.hansei.constant.Gender;
import com.example.hansei.constant.Role;
import com.example.hansei.login.dto.UserDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.crypto.password.PasswordEncoder;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "users")
@ToString
public class HanUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_name", nullable = false)
    private String name; // 이름

    @Column(unique = true, nullable = false)
    private String email; // 이메일

    @Column(unique = true, nullable = false)
    private String loginid; // 사용자 아이디

    @Column(nullable = false)
    private String password; // 암호화된 비밀번호

    @Column(nullable = false)
    private String phone; // 전화번호

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender = Gender.MALE; // ✅ 기본값 설정 (NullPointerException 방지)

    @Enumerated(EnumType.STRING)
    private Role role = Role.ROLE_USER; // ✅ 기본값 설정 (nullable 제거)

    @Column(nullable = false)
    private boolean sms; // 문자 수신 동의 여부
    
    @Column(nullable = false)
    private String depart; // 학과

    // 📌 [추가] @PrePersist: 엔티티 저장 전 기본값 설정
    @PrePersist
    public void prePersist() {
        if (this.role == null) {
            this.role = Role.ROLE_USER; // ✅ 기본값 설정
        }
        if (this.gender == null) {
            this.gender = Gender.MALE; // ✅ 기본값 설정
        }
    }

    // 📌 [추가] @PreUpdate: 엔티티 수정 시 체크
    @PreUpdate
    public void preUpdate() {
        if (this.role == null) {
            this.role = Role.ROLE_USER;
        }
        if (this.gender == null) {
            this.gender = Gender.MALE;
        }
    }

    public HanUser bind(UserDto userDto, PasswordEncoder passwordEncoder) {
        if (userDto == null) {
            throw new IllegalArgumentException("UserDto cannot be null");
        }

        this.setLoginid(userDto.getLoginid());
        this.setPassword(passwordEncoder.encode(userDto.getPassword()));
        this.setName(userDto.getName());
        this.setEmail(userDto.getEmail());
        this.setPhone(userDto.getPhone());
        this.setSms(userDto.isSms());
        this.setDepart(userDto.getDepart());

        // ✅ 성별이 null이면 기본값으로 MALE 설정
        this.setGender("female".equalsIgnoreCase(userDto.getGender()) ? Gender.FEMALE : Gender.MALE);

        return this;
    }
}
