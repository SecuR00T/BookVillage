package com.bookvillage.mock.controller;

import com.bookvillage.mock.dto.*;
import com.bookvillage.mock.security.UserPrincipal;
import com.bookvillage.mock.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;
@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/posts")
    public ResponseEntity<BoardPostPageDto> list(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(value = "q", required = false) String keyword,
            @RequestParam(value = "myOnly", defaultValue = "false") boolean myOnly,
            @RequestParam(value = "sort", defaultValue = "latest") String sort,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size) {
        return ResponseEntity.ok(boardService.getPosts(principal.getUserId(), keyword, myOnly, sort, page, size));
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<BoardPostDto> get(@PathVariable Long postId) {
        return ResponseEntity.ok(boardService.getPost(postId));
    }

    @PostMapping("/posts")
    public ResponseEntity<BoardPostDto> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody BoardPostRequest request) {
        return ResponseEntity.ok(boardService.create(principal.getUserId(), request));
    }

    @PutMapping("/posts/{postId}")
    public ResponseEntity<BoardPostDto> update(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long postId,
            @RequestBody BoardPostRequest request) {
        return ResponseEntity.ok(boardService.update(principal.getUserId(), postId, request));
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long postId) {
        boardService.delete(principal.getUserId(), postId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<BoardCommentPageDto> listComments(
            @PathVariable Long postId,
            @RequestParam(value = "sort", defaultValue = "latest") String sort,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size) {
        return ResponseEntity.ok(boardService.getComments(postId, sort, page, size));
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<BoardCommentDto> createComment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long postId,
            @RequestBody BoardCommentRequest request) {
        return ResponseEntity.ok(boardService.createComment(principal.getUserId(), postId, request));
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<BoardCommentDto> updateComment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long commentId,
            @RequestBody BoardCommentRequest request) {
        return ResponseEntity.ok(boardService.updateComment(principal.getUserId(), commentId, request));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long commentId) {
        boardService.deleteComment(principal.getUserId(), commentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/posts/{postId}/attachments")
    public ResponseEntity<List<BoardAttachmentDto>> listAttachments(@PathVariable Long postId) {
        return ResponseEntity.ok(boardService.getAttachments(postId));
    }

    @PostMapping("/posts/{postId}/attachments")
    public ResponseEntity<BoardAttachmentDto> uploadAttachment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long postId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(boardService.uploadAttachment(principal.getUserId(), postId, file));
    }

    @DeleteMapping("/posts/{postId}/attachments/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long postId,
            @PathVariable Long attachmentId) {
        boardService.deleteAttachment(principal.getUserId(), postId, attachmentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/attachments/{attachmentId}/download")
    public ResponseEntity<Resource> downloadAttachment(
            @PathVariable Long attachmentId) {
        BoardService.AttachmentDownload download = boardService.loadAttachment(attachmentId);
        String contentType = (download.getContentType() == null || download.getContentType().trim().isEmpty())
                ? MediaType.APPLICATION_OCTET_STREAM_VALUE
                : download.getContentType();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodeFileName(download.getOriginalName()))
                .contentType(MediaType.parseMediaType(contentType))
                .body(download.getResource());
    }

    private String encodeFileName(String filename) {
        byte[] bytes = filename == null ? new byte[0] : filename.getBytes(StandardCharsets.UTF_8);
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            int ch = b & 0xff;
            if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9') ||
                    ch == '-' || ch == '_' || ch == '.' || ch == '~') {
                sb.append((char) ch);
            } else {
                sb.append('%');
                String hex = Integer.toHexString(ch).toUpperCase();
                if (hex.length() == 1) {
                    sb.append('0');
                }
                sb.append(hex);
            }
        }
        return sb.toString();
    }
}
