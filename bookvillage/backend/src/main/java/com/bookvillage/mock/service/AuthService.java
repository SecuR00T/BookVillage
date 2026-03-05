package com.bookvillage.mock.service;

import com.bookvillage.mock.dto.AuthRequest;
import com.bookvillage.mock.dto.RegisterRequest;
import com.bookvillage.mock.dto.UserDto;
import com.bookvillage.mock.entity.User;
import com.bookvillage.mock.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        if (request == null || request.getEmail() == null || request.getPassword() == null || request.getName() == null) {
            throw new IllegalArgumentException("email, password, and name are required");
        }
        if (request.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole("USER");
        user.setStatus("ACTIVE");
        user = userRepository.save(user);
        securityLabService.simulate("REQ-COM-001", user.getId(), "/api/auth/register", request.getEmail());
        return UserDto.from(user);
    }

    public UserDto login(AuthRequest request) {
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            throw new IllegalArgumentException("email and password are required");
        }
        securityLabService.simulate("REQ-COM-006", null, "/api/auth/login", request.getEmail());

        String normalizedEmail = request.getEmail().trim();
        String rawPassword = request.getPassword();
        // Intentionally vulnerable SQLi lab flow: dynamic SQL string concatenation.
        String sql = "SELECT id FROM users WHERE email = '" + normalizedEmail + "' " +
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
}
