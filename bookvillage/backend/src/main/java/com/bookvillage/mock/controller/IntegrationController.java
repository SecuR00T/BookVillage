package com.bookvillage.mock.controller;

import com.bookvillage.mock.dto.LinkPreviewDto;
import com.bookvillage.mock.security.UserPrincipal;
import com.bookvillage.mock.service.LearningFeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/integration")
@RequiredArgsConstructor
public class IntegrationController {

    private final LearningFeatureService learningFeatureService;

    @PostMapping("/link-preview")
    public ResponseEntity<LinkPreviewDto> linkPreview(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, String> request) {
        String url = request != null ? request.get("url") : null;
        Long userId = principal != null ? principal.getUserId() : null;
        return ResponseEntity.ok(learningFeatureService.createLinkPreview(userId, url));
    }
}
