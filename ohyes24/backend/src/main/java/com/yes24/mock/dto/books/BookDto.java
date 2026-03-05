package com.yes24.mock.dto;

import com.yes24.mock.entity.Book;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BookDto {
    private Long id;
    private String isbn;
    private String title;
    private String author;
    private String publisher;
    private String category;
    private BigDecimal price;
    private Integer stock;
    private String description;
    private String coverImageUrl;
    private Double rating;
    private Long reviewCount;

    public static BookDto from(Book book) {
        BookDto dto = new BookDto();
        dto.setId(book.getId());
        dto.setIsbn(book.getIsbn());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setPublisher(book.getPublisher());
        dto.setCategory(book.getCategory());
        dto.setPrice(book.getPrice());
        dto.setStock(book.getStock());
        dto.setDescription(book.getDescription());
        dto.setCoverImageUrl(book.getCoverImageUrl());
        dto.setRating(null);
        dto.setReviewCount(0L);
        return dto;
    }
}
