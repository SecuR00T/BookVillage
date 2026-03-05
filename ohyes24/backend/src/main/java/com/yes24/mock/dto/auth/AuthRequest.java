package com.yes24.mock.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String loginId;
    private String email;
    private String password;
}
