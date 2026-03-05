package com.yes24.mock.controller.system;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(IllegalArgumentException e) {
        return error(HttpStatus.BAD_REQUEST, messageOrDefault(e.getMessage(), "?붿껌 ?뺤떇???щ컮瑜댁? ?딆뒿?덈떎."));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalState(IllegalStateException e) {
        return error(HttpStatus.SERVICE_UNAVAILABLE, messageOrDefault(e.getMessage(), "?꾩옱 ?붿껌??泥섎━?????놁뒿?덈떎. ?좎떆 ???ㅼ떆 ?쒕룄??二쇱꽭??"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleForbidden(AccessDeniedException e) {
        return error(HttpStatus.FORBIDDEN, "?묎렐 沅뚰븳???놁뒿?덈떎.");
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleUnauthorized(AuthenticationException e) {
        return error(HttpStatus.UNAUTHORIZED, "濡쒓렇?몄씠 ?꾩슂?섍굅???몄쬆??留뚮즺?섏뿀?듬땲??");
    }

    @ExceptionHandler({
            MissingServletRequestParameterException.class,
            HttpMessageNotReadableException.class
    })
    public ResponseEntity<Map<String, Object>> handleInvalidRequest(Exception e) {
        return error(HttpStatus.BAD_REQUEST, "?붿껌 蹂몃Ц ?먮뒗 ?뚮씪誘명꽣瑜??뺤씤??二쇱꽭??");
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> handleMethodNotAllowed(HttpRequestMethodNotSupportedException e) {
        return error(HttpStatus.METHOD_NOT_ALLOWED, "?덉슜?섏? ?딆? ?붿껌 諛⑹떇?낅땲??");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception e) {
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "?쒕쾭 ?대? ?ㅻ쪟媛 諛쒖깮?덉뒿?덈떎. ?좎떆 ???ㅼ떆 ?쒕룄??二쇱꽭??");
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }

    private String messageOrDefault(String message, String defaultMessage) {
        if (message == null || message.trim().isEmpty()) {
            return defaultMessage;
        }
        return message;
    }
}

