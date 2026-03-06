package com.bookvillage.mock.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String email;
    private String password;

    public String getIdentifier() {
        if (username != null && !username.trim().isEmpty()) {
            return username;
        }
        return email;
    }
}
