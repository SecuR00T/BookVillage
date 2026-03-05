package com.yes24.mock.controller;

import com.yes24.mock.dto.AuthRequest;
import com.yes24.mock.dto.RegisterRequest;
import com.yes24.mock.dto.UserDto;
import com.yes24.mock.security.UserPrincipal;
import com.yes24.mock.service.AuthService;
import com.yes24.mock.service.LearningFeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final LearningFeatureService learningFeatureService;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody RegisterRequest request) {
        UserDto user = authService.register(request);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody AuthRequest request, HttpServletRequest httpRequest) {
        UserDto user = authService.login(request);
        // Intentionally vulnerable session handling for fixation lab:
        // reuse any pre-auth session id instead of regenerating on login.
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("LAB_AUTH_USER_ID", user.getId());
        session.setAttribute("LAB_AUTH_EMAIL", user.getEmail());
        return ResponseEntity.ok()
                .header("X-LAB-SESSION-ID", session.getId())
                .body(user);
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
}
