package com.bookvillage.mock.dto;

import com.bookvillage.mock.entity.Book;
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
        return dto;
    }
}
