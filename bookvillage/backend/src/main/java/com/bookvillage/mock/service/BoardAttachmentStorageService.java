package com.bookvillage.mock.service;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
public class BoardAttachmentStorageService {

    private static final long MAX_FILE_SIZE = 10L * 1024L * 1024L;
    private static final Set<String> ALLOWED_EXTENSIONS = new HashSet<>(Arrays.asList(
            "png", "jpg", "jpeg", "gif", "webp", "pdf", "txt", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "zip"
    ));

    @Value("${file.base-path:./uploads}")
    private String basePathConfig;

    private Path attachmentBasePath;

    @PostConstruct
    public void init() {
        attachmentBasePath = Paths.get(basePathConfig, "board").toAbsolutePath().normalize();
        try {
            Files.createDirectories(attachmentBasePath);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize board attachment directory", e);
        }
    }

    public StoredFile store(MultipartFile file, Long postId) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("file is required");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Attachment size must be 10MB or less.");
        }

        String originalName = sanitizeOriginalName(file.getOriginalFilename());
        String ext = extensionOf(originalName);
        if (!ALLOWED_EXTENSIONS.contains(ext.toLowerCase(Locale.ROOT))) {
            throw new IllegalArgumentException("Unsupported file extension.");
        }

        String storedName = "post_" + postId + "_" + UUID.randomUUID() + "." + ext;
        Path target = attachmentBasePath.resolve(storedName).normalize();
        if (!target.startsWith(attachmentBasePath)) {
            throw new IllegalArgumentException("Invalid file path.");
        }

        try {
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store attachment", e);
        }

        String contentType = normalizeContentType(file.getContentType());
        return new StoredFile(originalName, storedName, contentType, file.getSize());
    }

    public Resource loadAsResource(String storedName) {
        String safeName = sanitizeStoredName(storedName);
        Path target = attachmentBasePath.resolve(safeName).normalize();
        if (!target.startsWith(attachmentBasePath)) {
            throw new IllegalArgumentException("Invalid file path.");
        }

        try {
            Resource resource = new UrlResource(target.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            }
            throw new IllegalArgumentException("Attachment not found.");
        } catch (IOException e) {
            throw new RuntimeException("Failed to read attachment", e);
        }
    }

    public void deleteQuietly(String storedName) {
        if (storedName == null || storedName.trim().isEmpty()) {
            return;
        }
        String safeName = sanitizeStoredName(storedName);
        Path target = attachmentBasePath.resolve(safeName).normalize();
        if (!target.startsWith(attachmentBasePath)) {
            return;
        }

        try {
            Files.deleteIfExists(target);
        } catch (IOException ignored) {
            // Best effort cleanup.
        }
    }

    private String sanitizeOriginalName(String originalName) {
        String normalized = originalName == null ? "" : originalName.trim();
        if (normalized.isEmpty()) {
            throw new IllegalArgumentException("original filename is required");
        }

        normalized = normalized.replace("\\", "/");
        int idx = normalized.lastIndexOf('/');
        if (idx >= 0) {
            normalized = normalized.substring(idx + 1);
        }
        if (normalized.isEmpty() || normalized.length() > 255) {
            throw new IllegalArgumentException("Invalid original filename.");
        }
        return normalized;
    }

    private String sanitizeStoredName(String storedName) {
        String normalized = storedName == null ? "" : storedName.trim();
        if (normalized.isEmpty() || normalized.contains("..") || normalized.contains("/") || normalized.contains("\\")) {
            throw new IllegalArgumentException("Invalid stored filename.");
        }
        return normalized;
    }

    private String extensionOf(String filename) {
        int dot = filename.lastIndexOf('.');
        if (dot <= 0 || dot == filename.length() - 1) {
            throw new IllegalArgumentException("File extension is required.");
        }
        return filename.substring(dot + 1);
    }

    private String normalizeContentType(String contentType) {
        if (contentType == null || contentType.trim().isEmpty()) {
            return "application/octet-stream";
        }
        return contentType.trim();
    }

    @Getter
    public static class StoredFile {
        private final String originalName;
        private final String storedName;
        private final String contentType;
        private final long size;

        public StoredFile(String originalName, String storedName, String contentType, long size) {
            this.originalName = originalName;
            this.storedName = storedName;
            this.contentType = contentType;
            this.size = size;
        }
    }
}
