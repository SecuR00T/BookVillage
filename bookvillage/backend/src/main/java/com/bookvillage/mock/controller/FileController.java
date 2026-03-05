package com.bookvillage.mock.controller;

import com.bookvillage.mock.service.FileService;
import com.bookvillage.mock.service.SecurityLabService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;
    private final SecurityLabService securityLabService;

    @GetMapping("/api/download")
    public ResponseEntity<?> download(@RequestParam String file) {
        try {
            Resource resource = fileService.loadFileAsResource(file);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage(),
                    "simulation", securityLabService.simulate("REQ-COM-015", null, "/api/download", file)
            ));
        }
    }
}
