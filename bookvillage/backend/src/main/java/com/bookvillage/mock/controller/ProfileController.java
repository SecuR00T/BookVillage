package com.bookvillage.mock.controller;

import com.bookvillage.mock.dto.UserDto;
import com.bookvillage.mock.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Intentionally vulnerable profile endpoint for IDOR lab.
 * Authenticated users can request arbitrary user_id without ownership check.
 */
@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserDto> getProfileByUserId(@RequestParam("user_id") Long userId) {
        UserDto profile = userService.getUserById(userId);
        return ResponseEntity.ok(profile);
    }
}
