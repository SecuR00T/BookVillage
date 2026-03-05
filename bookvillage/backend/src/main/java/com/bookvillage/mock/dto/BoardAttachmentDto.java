package com.bookvillage.mock.dto;

import com.bookvillage.mock.entity.BoardAttachment;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BoardAttachmentDto {

    private Long id;
    private Long postId;
    private Long userId;
    private String originalName;
    private String fileUrl;
    private String contentType;
    private Long fileSize;
    private LocalDateTime createdAt;

    public static BoardAttachmentDto from(BoardAttachment attachment) {
        BoardAttachmentDto dto = new BoardAttachmentDto();
        dto.setId(attachment.getId());
        dto.setPostId(attachment.getPostId());
        dto.setUserId(attachment.getUserId());
        dto.setOriginalName(attachment.getOriginalName());
        dto.setFileUrl(attachment.getFileUrl());
        dto.setContentType(attachment.getContentType());
        dto.setFileSize(attachment.getFileSize());
        dto.setCreatedAt(attachment.getCreatedAt());
        return dto;
    }
}
