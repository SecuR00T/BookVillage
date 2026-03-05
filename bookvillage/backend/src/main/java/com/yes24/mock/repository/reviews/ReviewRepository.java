package com.yes24.mock.repository.reviews;

import com.yes24.mock.entity.reviews.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByBookId(Long bookId);

    List<Review> findByUserId(Long userId);

    void deleteByUserId(Long userId);
}

