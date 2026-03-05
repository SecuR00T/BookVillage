package com.bookvillage.mock.repository;

import com.bookvillage.mock.entity.BoardComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface BoardCommentRepository extends JpaRepository<BoardComment, Long> {

    Page<BoardComment> findByPostIdOrderByCreatedAtDesc(Long postId, Pageable pageable);
    Page<BoardComment> findByPostIdOrderByCreatedAtAsc(Long postId, Pageable pageable);

    long countByPostId(Long postId);

    @Query("SELECT c.postId, COUNT(c.id) FROM BoardComment c WHERE c.postId IN :postIds GROUP BY c.postId")
    List<Object[]> countByPostIds(@Param("postIds") Collection<Long> postIds);

    void deleteByUserId(Long userId);
}
