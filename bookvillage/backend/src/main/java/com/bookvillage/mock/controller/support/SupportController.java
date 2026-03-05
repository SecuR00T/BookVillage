package com.yes24.mock.controller.support;

import com.yes24.mock.dto.support.FaqDto;
import com.yes24.mock.dto.support.NoticeDto;
import com.yes24.mock.security.users.UserPrincipal;
import com.yes24.mock.service.labs.LearningFeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class SupportController {

    private final LearningFeatureService learningFeatureService;

    @GetMapping("/api/notices")
    public ResponseEntity<List<NoticeDto>> notices(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(learningFeatureService.getNotices(q));
    }

    @GetMapping("/api/notices/{noticeId}")
    public ResponseEntity<NoticeDto> noticeDetail(@PathVariable Long noticeId) {
        return ResponseEntity.ok(learningFeatureService.getNotice(noticeId));
    }

    @GetMapping("/api/faqs")
    public ResponseEntity<List<FaqDto>> faqs(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(learningFeatureService.getFaqs(category));
    }

    @PostMapping("/api/customer-service/{inquiryId}/attachments")
    public ResponseEntity<Map<String, Object>> uploadInquiryAttachment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long inquiryId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(learningFeatureService.saveInquiryAttachment(principal.getUserId(), inquiryId, file));
    }
}

