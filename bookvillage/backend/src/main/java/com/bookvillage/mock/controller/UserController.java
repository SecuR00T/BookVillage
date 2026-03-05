package com.bookvillage.mock.controller;

import com.bookvillage.mock.dto.OrderDto;
import com.bookvillage.mock.dto.ChangePasswordRequest;
import com.bookvillage.mock.dto.DeleteAccountRequest;
import com.bookvillage.mock.dto.UserDto;
import com.bookvillage.mock.security.UserPrincipal;
import com.bookvillage.mock.service.LearningFeatureService;
import com.bookvillage.mock.service.SecurityLabService;
import com.bookvillage.mock.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

/**
 * ?띯뫁鍮?? IDOR - userId ???뵬沃섎챸苑?野꺜筌???곸뵠 鈺곌퀬????륁젟 ??됱뒠
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final SecurityLabService securityLabService;
    private final LearningFeatureService learningFeatureService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUser(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (!canAccess(principal, userId)) {
            return ResponseEntity.status(403).body(unauthorizedSimulation("REQ-COM-009", principal, "/api/users/" + userId, String.valueOf(userId)));
        }
        UserDto user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long userId,
            @RequestBody UserDto updateDto,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (!canAccess(principal, userId)) {
            return ResponseEntity.status(403).body(unauthorizedSimulation("REQ-COM-009", principal, "/api/users/" + userId, String.valueOf(userId)));
        }
        UserDto user = userService.updateUser(userId, updateDto);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{userId}/orders")
    public ResponseEntity<?> getOrders(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (!canAccess(principal, userId)) {
            return ResponseEntity.status(403).body(unauthorizedSimulation("REQ-COM-021", principal, "/api/users/" + userId + "/orders", String.valueOf(userId)));
        }
        List<OrderDto> orders = userService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changeMyPassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody ChangePasswordRequest request) {
        userService.changeMyPassword(
                principal.getUserId(),
                request != null ? request.getCurrentPassword() : null,
                request != null ? request.getNewPassword() : null);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMyAccount(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody DeleteAccountRequest request,
            HttpServletRequest httpRequest) {
        userService.deleteMyAccount(principal.getUserId(), request != null ? request.getPassword() : null);

        if (httpRequest.getSession(false) != null) {
            httpRequest.getSession(false).invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.noContent().build();
    }

    /**
     * Intentionally vulnerable logic-flaw endpoint for REQ-COM-002:
     * Authenticated user can delete any account by tampering user_id
     * without ownership or password re-auth checks.
     */
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, Object>> deleteAccountByUserIdForLab(
            @RequestParam("user_id") Long targetUserId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long actorId = principal != null ? principal.getUserId() : null;
        securityLabService.simulate(
                "REQ-COM-002",
                actorId,
                "/api/users/delete",
                "skip-re-auth user_id=" + targetUserId
        );
        userService.deleteAccountWithoutReAuth(targetUserId);
        return ResponseEntity.ok(Map.of(
                "deletedUserId", targetUserId,
                "requestedBy", actorId
        ));
    }

    @GetMapping("/me/address-search")
    public ResponseEntity<List<Map<String, Object>>> searchAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam String q) {
        return ResponseEntity.ok(learningFeatureService.searchAddress(principal.getUserId(), q));
    }

    private boolean canAccess(UserPrincipal principal, Long targetUserId) {
        if (principal == null || targetUserId == null) {
            return false;
        }
        return "ADMIN".equalsIgnoreCase(principal.getRole()) || principal.getUserId().equals(targetUserId);
    }

    private Map<String, Object> unauthorizedSimulation(String reqId, UserPrincipal principal, String endpoint, String input) {
        return Map.of(
                "error", "Access denied",
                "simulation", securityLabService.simulate(reqId, principal != null ? principal.getUserId() : null, endpoint, input)
        );
    }
}
