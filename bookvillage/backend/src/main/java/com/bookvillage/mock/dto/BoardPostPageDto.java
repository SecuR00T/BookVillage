package com.bookvillage.mock.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BoardPostPageDto {

    private List<BoardPostDto> items;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean hasNext;
    private boolean hasPrevious;

    public static BoardPostPageDto of(List<BoardPostDto> items,
                                      int page,
                                      int size,
                                      long totalElements,
                                      int totalPages,
                                      boolean hasNext,
                                      boolean hasPrevious) {
        BoardPostPageDto dto = new BoardPostPageDto();
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
