package com.bookvillage.mock.controller;

import com.bookvillage.mock.dto.BookDto;
import com.bookvillage.mock.security.UserPrincipal;
import com.bookvillage.mock.service.BookService;
import com.bookvillage.mock.service.LearningFeatureService;
import com.bookvillage.mock.service.SecurityLabService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    private final SecurityLabService securityLabService;
    private final LearningFeatureService learningFeatureService;

    @GetMapping("/search")
    public ResponseEntity<List<BookDto>> search(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category) {
        if (q != null && !q.trim().isEmpty()) {
            securityLabService.simulate("REQ-COM-010", principal != null ? principal.getUserId() : null, "/api/books/search", q);
        }
        if (category != null && !category.trim().isEmpty()) {
            securityLabService.simulate("REQ-COM-011", principal != null ? principal.getUserId() : null, "/api/books/search", category);
        }
        List<BookDto> books = bookService.search(q, category);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = bookService.getCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<BookDto> getBook(
            @PathVariable Long bookId,
            @AuthenticationPrincipal UserPrincipal principal) {
        BookDto book = bookService.getBookById(bookId);
        if (principal != null) {
            learningFeatureService.trackRecentView(principal.getUserId(), bookId);
        }
        securityLabService.simulate("REQ-COM-012", principal != null ? principal.getUserId() : null, "/api/books/" + bookId, book.getDescription());
        return ResponseEntity.ok(book);
    }

    @GetMapping("/{bookId}/shipping-info")
    public ResponseEntity<Map<String, Object>> shippingInfo(
            @PathVariable Long bookId,
            @RequestParam(required = false) String zipcode,
            @AuthenticationPrincipal UserPrincipal principal) {
        String input = zipcode == null ? "" : zipcode;
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("bookId", bookId);
        body.put("zipcode", zipcode);
        body.put("etaDays", 1 + (bookId.intValue() % 3));
        body.put("carrier", "BOOKVILLAGE Logistics");
        body.put("simulation", securityLabService.simulate("REQ-COM-013", principal != null ? principal.getUserId() : null, "/api/books/" + bookId + "/shipping-info", input));
        return ResponseEntity.ok(body);
    }

    @GetMapping("/{bookId}/preview")
    public ResponseEntity<Map<String, Object>> preview(
            @PathVariable Long bookId,
            @RequestParam(required = false) String filePath,
            @AuthenticationPrincipal UserPrincipal principal) {
        BookDto book = bookService.getBookById(bookId);
        String source = filePath == null ? "preview-" + bookId + ".txt" : filePath;
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("bookId", bookId);
        body.put("source", source);
        body.put("previewText", (book.getDescription() == null ? "" : book.getDescription()).substring(0,
                Math.min(120, book.getDescription() == null ? 0 : book.getDescription().length())));
        body.put("simulation", securityLabService.simulate("REQ-COM-014", principal != null ? principal.getUserId() : null, "/api/books/" + bookId + "/preview", source));
        return ResponseEntity.ok(body);
    }
}
