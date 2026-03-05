package com.yes24.mock.controller;

import com.yes24.mock.dto.BookDto;
import com.yes24.mock.security.UserPrincipal;
import com.yes24.mock.service.BookService;
import com.yes24.mock.service.LearningFeatureService;
import com.yes24.mock.service.SecurityLabService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
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
        LocalDateTime nowKst = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        LocalTime cutoff = LocalTime.of(15, 0);

        int processDelayDays = nowKst.toLocalTime().isAfter(cutoff) ? 1 : 0;
        int regionalDelayDays = regionDelayDays(zipcode);
        int etaDays = 1 + processDelayDays + regionalDelayDays;

        LocalDate arrivalDate = addBusinessDays(nowKst.toLocalDate(), etaDays);
        LocalDateTime arrivalDateTime = arrivalDate.atTime(18, 0);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("bookId", bookId);
        body.put("zipcode", zipcode);
        body.put("etaDays", etaDays);
        body.put("carrier", "BOOKCHON Logistics");
        body.put("orderCutoffTime", cutoff.format(DateTimeFormatter.ofPattern("HH:mm")));
        body.put("estimatedArrivalDate", arrivalDate.format(DateTimeFormatter.ISO_LOCAL_DATE));
        body.put("estimatedArrivalDateTime", arrivalDateTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        body.put("calculatedAt", nowKst.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        body.put("simulation", securityLabService.simulate("REQ-COM-013", principal != null ? principal.getUserId() : null, "/api/books/" + bookId + "/shipping-info", input));
        return ResponseEntity.ok(body);
    }

    private int regionDelayDays(String zipcode) {
        if (zipcode == null || zipcode.trim().isEmpty()) {
            return 1;
        }
        String z = zipcode.trim();
        if (z.startsWith("0") || z.startsWith("1")) {
            return 0;
        }
        if (z.startsWith("2") || z.startsWith("3")) {
            return 1;
        }
        return 2;
    }

    private LocalDate addBusinessDays(LocalDate start, int days) {
        LocalDate date = start;
        int added = 0;
        while (added < days) {
            date = date.plusDays(1);
            DayOfWeek day = date.getDayOfWeek();
            if (day != DayOfWeek.SATURDAY && day != DayOfWeek.SUNDAY) {
                added++;
            }
        }
        return date;
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

