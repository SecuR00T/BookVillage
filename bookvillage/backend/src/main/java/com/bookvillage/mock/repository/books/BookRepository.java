package com.yes24.mock.repository.books;

import com.yes24.mock.entity.books.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByCategory(String category);
}

