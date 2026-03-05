package com.bookvillage.mock.repository;

import com.bookvillage.mock.entity.BoardAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface BoardAttachmentRepository extends JpaRepository<BoardAttachment, Long> {

    List<BoardAttachment> findByPostIdOrderByCreatedAtAsc(Long postId);

    Optional<BoardAttachment> findByIdAndPostId(Long id, Long postId);

    long countByPostId(Long postId);

    @Query("SELECT a.postId, COUNT(a.id) FROM BoardAttachment a WHERE a.postId IN :postIds GROUP BY a.postId")
    List<Object[]> countByPostIds(@Param("postIds") Collection<Long> postIds);

    void deleteByUserId(Long userId);
}
