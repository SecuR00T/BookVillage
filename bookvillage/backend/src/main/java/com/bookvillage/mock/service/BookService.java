package com.bookvillage.mock.service;

import com.bookvillage.mock.dto.BookDto;
import com.bookvillage.mock.entity.Book;
import com.bookvillage.mock.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public BookDto getBookById(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));
        return BookDto.from(book);
    }

    public List<BookDto> search(String query, String category) {
        String normalizedQuery = query == null ? "" : query.trim().toLowerCase();
        String normalizedCategory = category == null ? "" : category.trim();

        return bookRepository.findAll(Sort.by(Sort.Direction.DESC, "id")).stream()
                .filter(book -> matchesQuery(book, normalizedQuery))
                .filter(book -> normalizedCategory.isEmpty() || normalizedCategory.equals(book.getCategory()))
                .map(BookDto::from)
                .collect(Collectors.toList());
    }

    public List<String> getCategories() {
        return bookRepository.findAll().stream()
                .map(Book::getCategory)
                .filter(c -> c != null && !c.isEmpty())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    private boolean matchesQuery(Book book, String query) {
        if (query.isEmpty()) {
            return true;
        }
        return containsIgnoreCase(book.getTitle(), query)
                || containsIgnoreCase(book.getAuthor(), query)
                || containsIgnoreCase(book.getPublisher(), query)
                || containsIgnoreCase(book.getIsbn(), query);
    }

    private boolean containsIgnoreCase(String source, String needle) {
        return source != null && source.toLowerCase().contains(needle);
    }
}
