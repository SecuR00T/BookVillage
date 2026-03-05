package com.bookvillage.mock.dto;

import com.bookvillage.mock.entity.BoardPost;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BoardPostDto {

    private Long id;
    private Long userId;
    private String authorName;
    private String title;
    private String content;
    private long commentCount;
    private long attachmentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BoardPostDto from(BoardPost post, String authorName, long commentCount, long attachmentCount) {
        BoardPostDto dto = new BoardPostDto();
        dto.setId(post.getId());
        dto.setUserId(post.getUserId());
        dto.setAuthorName(authorName);
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setCommentCount(commentCount);
        dto.setAttachmentCount(attachmentCount);
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        return dto;
    }
}
