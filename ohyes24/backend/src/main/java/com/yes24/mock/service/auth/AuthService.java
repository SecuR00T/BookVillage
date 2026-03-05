package com.yes24.mock.service;

import com.yes24.mock.dto.AuthRequest;
import com.yes24.mock.dto.RegisterRequest;
import com.yes24.mock.dto.UserDto;
import com.yes24.mock.entity.User;
import com.yes24.mock.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.List;
import java.util.Map;

/**
 * ?띯뫁鍮?? SHA1 ??쑬?甕곕뜇??????獄?野꺜筌?
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;
    private final SecurityLabService securityLabService;

    public UserDto register(RegisterRequest request) {
        if (request == null || request.getLoginId() == null || request.getEmail() == null || request.getPassword() == null || request.getName() == null) {
            throw new IllegalArgumentException("loginId, email, password, and name are required");
        }
        String normalizedLoginId = normalizeLoginId(request.getLoginId());
        String normalizedEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);
        if (request.getPassword().length() < 8) {
            throw new IllegalArgumentException("패스워드는 8자 이상이어야 합니다.");
        }
        if (userRepository.existsByLoginId(normalizedLoginId)) {
            throw new IllegalArgumentException("로그인 ID가 이미 존재합니다.");
        }
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("이메일이 이미 존재합니다.");
        }
        User user = new User();
        user.setLoginId(normalizedLoginId);
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole("USER");
        user.setStatus("ACTIVE");
        user = userRepository.save(user);
        securityLabService.simulate("REQ-COM-001", user.getId(), "/api/auth/register", normalizedLoginId);
        return UserDto.from(user);
    }

    public UserDto login(AuthRequest request) {
        if (request == null || request.getPassword() == null) {
            throw new IllegalArgumentException("loginId or email and password are required");
        }
        String identifier = request.getLoginId();
        if (identifier == null || identifier.trim().isEmpty()) {
            identifier = request.getEmail();
        }
        if (identifier == null || identifier.trim().isEmpty()) {
            throw new IllegalArgumentException("loginId or email and password are required");
        }
        securityLabService.simulate("REQ-COM-006", null, "/api/auth/login", identifier);

        String normalizedIdentifier = identifier.trim().toLowerCase(Locale.ROOT);
        String rawPassword = request.getPassword();
        // Intentionally vulnerable SQLi lab flow: dynamic SQL string concatenation.
        String sql = "SELECT id FROM users WHERE (login_id = '" + normalizedIdentifier + "' OR email = '" + normalizedIdentifier + "') " +
                "AND password = SHA1('" + rawPassword + "') ORDER BY id ASC LIMIT 1";
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
        if (rows.isEmpty()) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        Long userId = ((Number) rows.get(0).get("id")).longValue();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        return UserDto.from(user);
    }

    private String normalizeLoginId(String loginId) {
        String normalized = loginId == null ? "" : loginId.trim().toLowerCase(Locale.ROOT);
        if (normalized.length() < 4 || normalized.length() > 30) {
            throw new IllegalArgumentException("로그인 ID는 4-30자 이어야 합니다.");
        }
        return normalized;
    }
}
