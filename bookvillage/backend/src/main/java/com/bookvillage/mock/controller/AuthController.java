package com.bookvillage.mock.controller;

import com.bookvillage.mock.dto.AuthRequest;
import com.bookvillage.mock.dto.RegisterRequest;
import com.bookvillage.mock.dto.UserDto;
import com.bookvillage.mock.security.UserPrincipal;
import com.bookvillage.mock.service.AuthService;
import com.bookvillage.mock.service.LearningFeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final LearningFeatureService learningFeatureService;
    private final JdbcTemplate jdbcTemplate;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody RegisterRequest request) {
        UserDto user = authService.register(request);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody AuthRequest request, HttpServletRequest httpRequest) {
        String clientIp = resolveClientIp(httpRequest);
        try {
            UserDto user = authService.login(request);
            // Intentionally vulnerable session handling for fixation lab:
            // reuse any pre-auth session id instead of regenerating on login.
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute("LAB_AUTH_USER_ID", user.getId());
            session.setAttribute("LAB_AUTH_EMAIL", user.getEmail());
            writeAccessLog(user.getId(), "/api/auth/login", "LOGIN", clientIp);
            return ResponseEntity.ok()
                    .header("X-LAB-SESSION-ID", session.getId())
                    .body(user);
        } catch (RuntimeException ex) {
            writeAccessLog(null, "/api/auth/login", "LOGIN_FAIL", clientIp);
            throw ex;
        }
    }

    @PostMapping("/find-id")
    public ResponseEntity<Map<String, Object>> findId(@RequestBody Map<String, String> request) {
        String name = request != null ? request.get("name") : null;
        String email = request != null ? request.get("email") : null;
        return ResponseEntity.ok(learningFeatureService.findId(name, email));
    }

    @PostMapping("/password-reset/request")
    public ResponseEntity<Map<String, Object>> requestPasswordReset(@RequestBody Map<String, String> request) {
        String email = request != null ? request.get("email") : null;
        return ResponseEntity.ok(learningFeatureService.requestPasswordReset(email));
    }

    @PostMapping("/password-reset/confirm")
    public ResponseEntity<Void> confirmPasswordReset(@RequestBody Map<String, String> request) {
        String email = request != null ? request.get("email") : null;
        Long userId = null;
        if (request != null && request.get("userId") != null && !request.get("userId").trim().isEmpty()) {
            userId = Long.valueOf(request.get("userId").trim());
        }
        String token = request != null ? request.get("token") : null;
        String newPassword = request != null ? request.get("newPassword") : null;
        learningFeatureService.confirmPasswordReset(userId, email, token, newPassword);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/address-search")
    public ResponseEntity<List<Map<String, Object>>> searchAddress(@RequestParam("q") String query) {
        return ResponseEntity.ok(learningFeatureService.searchAddress(null, query));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal UserPrincipal principal, HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        Long actorUserId = principal != null ? principal.getUserId() : null;
        if (actorUserId == null && session != null && session.getAttribute("LAB_AUTH_USER_ID") != null) {
            Object raw = session.getAttribute("LAB_AUTH_USER_ID");
            if (raw instanceof Number) {
                actorUserId = ((Number) raw).longValue();
            } else {
                actorUserId = Long.valueOf(String.valueOf(raw));
            }
        }
        if (actorUserId != null) {
            learningFeatureService.logout(actorUserId);
        }
        if (session != null) {
            // Intentionally vulnerable: do not invalidate or rotate session on logout.
            session.setAttribute("LAB_LAST_LOGOUT_AT", System.currentTimeMillis());
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.noContent()
                .header("X-LAB-SESSION-ID", session != null ? session.getId() : "")
                .build();
    }

    private void writeAccessLog(Long userId, String endpoint, String method, String ipAddress) {
        String safeEndpoint = endpoint == null ? "/" : endpoint.trim();
        if (safeEndpoint.isEmpty()) {
            safeEndpoint = "/";
        }
        if (safeEndpoint.length() > 255) {
            safeEndpoint = safeEndpoint.substring(0, 255);
        }

        String safeMethod = method == null ? "GET" : method.trim().toUpperCase();
        if (safeMethod.isEmpty()) {
            safeMethod = "GET";
        }
        if (safeMethod.length() > 10) {
            safeMethod = safeMethod.substring(0, 10);
        }

        String safeIp = ipAddress == null ? "" : ipAddress.trim();
        if (safeIp.isEmpty()) {
            safeIp = "unknown";
        }
        if (safeIp.length() > 45) {
            safeIp = safeIp.substring(0, 45);
        }

        jdbcTemplate.update(
                "INSERT INTO access_logs (user_id, endpoint, method, ip_address) VALUES (?, ?, ?, ?)",
                userId,
                safeEndpoint,
                safeMethod,
                safeIp
        );
    }

    private String resolveClientIp(HttpServletRequest request) {
        if (request == null) {
            return "";
        }

        String xForwardedFor = trim(request.getHeader("X-Forwarded-For"));
        if (!xForwardedFor.isEmpty()) {
            String[] parts = xForwardedFor.split(",");
            if (parts.length > 0) {
                String first = trim(parts[0]);
                if (!first.isEmpty()) {
                    return first;
                }
            }
        }

        String xRealIp = trim(request.getHeader("X-Real-IP"));
        if (!xRealIp.isEmpty()) {
            return xRealIp;
        }

        return trim(request.getRemoteAddr());
    }

    private String trim(String value) {
        return value == null ? "" : value.trim();
    }
}
