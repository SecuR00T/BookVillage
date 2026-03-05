package com.bookvillage.mock.dto;

import com.bookvillage.mock.entity.BoardComment;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BoardCommentDto {

    private Long id;
    private Long postId;
    private Long userId;
    private String authorName;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BoardCommentDto from(BoardComment comment, String authorName) {
        BoardCommentDto dto = new BoardCommentDto();
        dto.setId(comment.getId());
        dto.setPostId(comment.getPostId());
        dto.setUserId(comment.getUserId());
        dto.setAuthorName(authorName);
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }
}
