package com.yes24.mock.controller;

import com.yes24.mock.dto.LinkPreviewDto;
import com.yes24.mock.security.UserPrincipal;
import com.yes24.mock.service.LearningFeatureService;
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
