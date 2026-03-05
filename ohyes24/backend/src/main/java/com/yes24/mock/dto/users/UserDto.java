package com.yes24.mock.dto;

import com.yes24.mock.entity.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDto {
    private Long id;
    private String loginId;
    private String email;
    private String name;
    private String phone;
    private String address;
    private String role;
    private String status;
    private LocalDateTime suspendedUntil;
    private LocalDateTime createdAt;

    public static UserDto from(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setLoginId(user.getLoginId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setSuspendedUntil(user.getSuspendedUntil());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
