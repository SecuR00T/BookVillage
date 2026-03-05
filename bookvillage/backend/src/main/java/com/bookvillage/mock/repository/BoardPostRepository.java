package com.bookvillage.mock.repository;

import com.bookvillage.mock.entity.BoardPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BoardPostRepository extends JpaRepository<BoardPost, Long> {

    @Query("SELECT p FROM BoardPost p " +
            "WHERE (:myOnly = false OR p.userId = :userId) " +
            "AND (:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "ORDER BY p.createdAt DESC")
    Page<BoardPost> searchLatest(@Param("userId") Long userId,
                                 @Param("myOnly") boolean myOnly,
                                 @Param("keyword") String keyword,
                                 Pageable pageable);

    @Query("SELECT p FROM BoardPost p " +
            "WHERE (:myOnly = false OR p.userId = :userId) " +
            "AND (:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "ORDER BY ((2 * (SELECT COUNT(c.id) FROM BoardComment c WHERE c.postId = p.id)) + " +
            "(SELECT COUNT(a.id) FROM BoardAttachment a WHERE a.postId = p.id)) DESC, p.createdAt DESC")
    Page<BoardPost> searchPopular(@Param("userId") Long userId,
                                  @Param("myOnly") boolean myOnly,
                                  @Param("keyword") String keyword,
                                  Pageable pageable);

    void deleteByUserId(Long userId);
}
