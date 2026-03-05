package com.bookvillage.mock.controller;

import com.bookvillage.mock.dto.CartItemDto;
import com.bookvillage.mock.security.UserPrincipal;
import com.bookvillage.mock.service.LearningFeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final LearningFeatureService learningFeatureService;

    @GetMapping
    public ResponseEntity<List<CartItemDto>> getCart(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(learningFeatureService.getCart(principal.getUserId()));
    }

    @PostMapping
    public ResponseEntity<Void> addItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, Object> request) {
        Long bookId = request.get("bookId") == null ? null : Long.valueOf(String.valueOf(request.get("bookId")));
        Integer quantity = request.get("quantity") == null ? null : Integer.valueOf(String.valueOf(request.get("quantity")));
        BigDecimal providedPrice = request.get("price") == null ? null : new BigDecimal(String.valueOf(request.get("price")));
        learningFeatureService.addCartItem(principal.getUserId(), bookId, quantity, providedPrice);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<Void> updateItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long cartItemId,
            @RequestBody Map<String, Object> request) {
        Integer quantity = request.get("quantity") == null ? null : Integer.valueOf(String.valueOf(request.get("quantity")));
        learningFeatureService.updateCartItem(principal.getUserId(), cartItemId, quantity);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> deleteItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long cartItemId) {
        learningFeatureService.deleteCartItem(principal.getUserId(), cartItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clear(@AuthenticationPrincipal UserPrincipal principal) {
        learningFeatureService.clearCart(principal.getUserId());
        return ResponseEntity.noContent().build();
    }
}
