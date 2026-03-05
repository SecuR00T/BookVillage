package com.bookvillage.mock.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BoardCommentPageDto {

    private List<BoardCommentDto> items;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean hasNext;
    private boolean hasPrevious;

    public static BoardCommentPageDto of(List<BoardCommentDto> items,
                                         int page,
                                         int size,
                                         long totalElements,
                                         int totalPages,
                                         boolean hasNext,
                                         boolean hasPrevious) {
        BoardCommentPageDto dto = new BoardCommentPageDto();
        dto.setItems(items);
        dto.setPage(page);
        dto.setSize(size);
        dto.setTotalElements(totalElements);
        dto.setTotalPages(totalPages);
        dto.setHasNext(hasNext);
        dto.setHasPrevious(hasPrevious);
        return dto;
    }
}
