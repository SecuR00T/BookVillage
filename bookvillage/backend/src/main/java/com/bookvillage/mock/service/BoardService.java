package com.bookvillage.mock.service;

import com.bookvillage.mock.dto.*;
import com.bookvillage.mock.entity.BoardAttachment;
import com.bookvillage.mock.entity.BoardComment;
import com.bookvillage.mock.entity.BoardPost;
import com.bookvillage.mock.entity.User;
import com.bookvillage.mock.repository.BoardAttachmentRepository;
import com.bookvillage.mock.repository.BoardCommentRepository;
import com.bookvillage.mock.repository.BoardPostRepository;
import com.bookvillage.mock.repository.UserRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardService {

    private static final String SORT_LATEST = "latest";
    private static final String SORT_POPULAR = "popular";
    private static final String SORT_OLDEST = "oldest";
    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 10;
    private static final int MAX_SIZE = 50;

    private final BoardPostRepository boardPostRepository;
    private final BoardCommentRepository boardCommentRepository;
    private final BoardAttachmentRepository boardAttachmentRepository;
    private final BoardAttachmentStorageService boardAttachmentStorageService;
    private final UserRepository userRepository;

    public BoardPostPageDto getPosts(Long userId, String keyword, boolean myOnly, String sort, Integer page, Integer size) {
        int safePage = normalizePage(page);
        int safeSize = normalizeSize(size);
        String safeSort = normalizeSort(sort);
        String normalizedKeyword = normalizeKeyword(keyword);

        Page<BoardPost> result = SORT_POPULAR.equals(safeSort)
                ? boardPostRepository.searchPopular(userId, myOnly, normalizedKeyword, PageRequest.of(safePage, safeSize))
                : boardPostRepository.searchLatest(userId, myOnly, normalizedKeyword, PageRequest.of(safePage, safeSize));

        List<BoardPost> posts = result.getContent();
        Set<Long> postIds = extractPostIds(posts);
        Map<Long, String> userNameMap = buildUserNameMap(posts.stream().map(BoardPost::getUserId).collect(Collectors.toSet()));
        Map<Long, Long> commentCountMap = postIds.isEmpty()
                ? Collections.emptyMap()
                : buildCountMap(boardCommentRepository.countByPostIds(postIds));
        Map<Long, Long> attachmentCountMap = postIds.isEmpty()
                ? Collections.emptyMap()
                : buildCountMap(boardAttachmentRepository.countByPostIds(postIds));

        List<BoardPostDto> items = posts.stream()
                .map(post -> BoardPostDto.from(
                        post,
                        userNameMap.getOrDefault(post.getUserId(), "Unknown"),
                        commentCountMap.getOrDefault(post.getId(), 0L),
                        attachmentCountMap.getOrDefault(post.getId(), 0L)
                ))
                .collect(Collectors.toList());

        return BoardPostPageDto.of(
                items,
                safePage,
                safeSize,
                result.getTotalElements(),
                result.getTotalPages(),
                result.hasNext(),
                result.hasPrevious()
        );
    }

    public BoardPostDto getPost(Long postId) {
        BoardPost post = findPost(postId);
        String authorName = userRepository.findById(post.getUserId()).map(User::getName).orElse("Unknown");
        long commentCount = boardCommentRepository.countByPostId(postId);
        long attachmentCount = boardAttachmentRepository.countByPostId(postId);
        return BoardPostDto.from(post, authorName, commentCount, attachmentCount);
    }

    @Transactional
    public BoardPostDto create(Long userId, BoardPostRequest request) {
        ValidatedPost validated = validatePost(request);

        BoardPost post = new BoardPost();
        post.setUserId(userId);
        post.setTitle(validated.title);
        post.setContent(validated.content);
        BoardPost saved = boardPostRepository.save(post);

        String authorName = userRepository.findById(saved.getUserId()).map(User::getName).orElse("Unknown");
        return BoardPostDto.from(saved, authorName, 0L, 0L);
    }

    @Transactional
    public BoardPostDto update(Long userId, Long postId, BoardPostRequest request) {
        ValidatedPost validated = validatePost(request);
        BoardPost post = findPost(postId);
        ensurePostOwner(userId, post);

        post.setTitle(validated.title);
        post.setContent(validated.content);

        String authorName = userRepository.findById(post.getUserId()).map(User::getName).orElse("Unknown");
        long commentCount = boardCommentRepository.countByPostId(postId);
        long attachmentCount = boardAttachmentRepository.countByPostId(postId);
        return BoardPostDto.from(post, authorName, commentCount, attachmentCount);
    }

    @Transactional
    public void delete(Long userId, Long postId) {
        BoardPost post = findPost(postId);
        ensurePostOwner(userId, post);

        List<BoardAttachment> attachments = boardAttachmentRepository.findByPostIdOrderByCreatedAtAsc(postId);
        boardPostRepository.delete(post);
        for (BoardAttachment attachment : attachments) {
            boardAttachmentStorageService.deleteQuietly(attachment.getStoredName());
        }
    }

    public BoardCommentPageDto getComments(Long postId, String sort, Integer page, Integer size) {
        findPost(postId);
        int safePage = normalizePage(page);
        int safeSize = normalizeSize(size);
        String safeSort = normalizeCommentSort(sort);
        Page<BoardComment> result = SORT_OLDEST.equals(safeSort)
                ? boardCommentRepository.findByPostIdOrderByCreatedAtAsc(postId, PageRequest.of(safePage, safeSize))
                : boardCommentRepository.findByPostIdOrderByCreatedAtDesc(postId, PageRequest.of(safePage, safeSize));
        List<BoardComment> comments = result.getContent();
        Map<Long, String> userNameMap = buildUserNameMap(comments.stream().map(BoardComment::getUserId).collect(Collectors.toSet()));

        List<BoardCommentDto> items = comments.stream()
                .map(comment -> BoardCommentDto.from(comment, userNameMap.getOrDefault(comment.getUserId(), "Unknown")))
                .collect(Collectors.toList());

        return BoardCommentPageDto.of(
                items,
                safePage,
                safeSize,
                result.getTotalElements(),
                result.getTotalPages(),
                result.hasNext(),
                result.hasPrevious()
        );
    }

    @Transactional
    public BoardCommentDto createComment(Long userId, Long postId, BoardCommentRequest request) {
        findPost(postId);
        String content = validateCommentContent(request);

        BoardComment comment = new BoardComment();
        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setContent(content);
        BoardComment saved = boardCommentRepository.save(comment);

        String authorName = userRepository.findById(userId).map(User::getName).orElse("Unknown");
        return BoardCommentDto.from(saved, authorName);
    }

    @Transactional
    public BoardCommentDto updateComment(Long userId, Long commentId, BoardCommentRequest request) {
        String content = validateCommentContent(request);
        BoardComment comment = findComment(commentId);
        ensureCommentOwner(userId, comment);

        comment.setContent(content);
        String authorName = userRepository.findById(userId).map(User::getName).orElse("Unknown");
        return BoardCommentDto.from(comment, authorName);
    }

    @Transactional
    public void deleteComment(Long userId, Long commentId) {
        BoardComment comment = findComment(commentId);
        ensureCommentOwner(userId, comment);
        boardCommentRepository.delete(comment);
    }

    public List<BoardAttachmentDto> getAttachments(Long postId) {
        findPost(postId);
        return boardAttachmentRepository.findByPostIdOrderByCreatedAtAsc(postId).stream()
                .map(BoardAttachmentDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public BoardAttachmentDto uploadAttachment(Long userId, Long postId, MultipartFile file) {
        BoardPost post = findPost(postId);
        ensurePostOwner(userId, post);

        BoardAttachmentStorageService.StoredFile storedFile = boardAttachmentStorageService.store(file, postId);
        try {
            BoardAttachment attachment = new BoardAttachment();
            attachment.setPostId(postId);
            attachment.setUserId(userId);
            attachment.setOriginalName(storedFile.getOriginalName());
            attachment.setStoredName(storedFile.getStoredName());
            attachment.setContentType(storedFile.getContentType());
            attachment.setFileSize(storedFile.getSize());
            attachment.setFileUrl("");
            attachment = boardAttachmentRepository.save(attachment);

            attachment.setFileUrl("/api/board/attachments/" + attachment.getId() + "/download");
            attachment = boardAttachmentRepository.save(attachment);
            return BoardAttachmentDto.from(attachment);
        } catch (RuntimeException e) {
            boardAttachmentStorageService.deleteQuietly(storedFile.getStoredName());
            throw e;
        }
    }

    @Transactional
    public void deleteAttachment(Long userId, Long postId, Long attachmentId) {
        BoardPost post = findPost(postId);
        ensurePostOwner(userId, post);

        BoardAttachment attachment = boardAttachmentRepository.findByIdAndPostId(attachmentId, postId)
                .orElseThrow(() -> new IllegalArgumentException("Attachment not found."));
        boardAttachmentRepository.delete(attachment);
        boardAttachmentStorageService.deleteQuietly(attachment.getStoredName());
    }

    public AttachmentDownload loadAttachment(Long attachmentId) {
        BoardAttachment attachment = boardAttachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new IllegalArgumentException("Attachment not found."));
        Resource resource = boardAttachmentStorageService.loadAsResource(attachment.getStoredName());
        return new AttachmentDownload(resource, attachment.getOriginalName(), attachment.getContentType());
    }

    private BoardPost findPost(Long postId) {
        return boardPostRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found."));
    }

    private BoardComment findComment(Long commentId) {
        return boardCommentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found."));
    }

    private void ensurePostOwner(Long userId, BoardPost post) {
        if (!Objects.equals(post.getUserId(), userId)) {
            throw new IllegalArgumentException("Only the post owner can modify this post.");
        }
    }

    private void ensureCommentOwner(Long userId, BoardComment comment) {
        if (!Objects.equals(comment.getUserId(), userId)) {
            throw new IllegalArgumentException("Only the comment owner can modify this comment.");
        }
    }

    private ValidatedPost validatePost(BoardPostRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required.");
        }

        String title = request.getTitle() == null ? "" : request.getTitle().trim();
        if (title.isEmpty()) {
            throw new IllegalArgumentException("Title is required.");
        }
        if (title.length() > 200) {
            throw new IllegalArgumentException("Title must be 200 characters or less.");
        }

        String content = request.getContent() == null ? "" : request.getContent().trim();
        if (content.isEmpty()) {
            throw new IllegalArgumentException("Content is required.");
        }
        if (content.length() > 5000) {
            throw new IllegalArgumentException("Content must be 5000 characters or less.");
        }

        return new ValidatedPost(title, content);
    }

    private String validateCommentContent(BoardCommentRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required.");
        }
        String content = request.getContent() == null ? "" : request.getContent().trim();
        if (content.isEmpty()) {
            throw new IllegalArgumentException("Comment content is required.");
        }
        if (content.length() > 1000) {
            throw new IllegalArgumentException("Comment must be 1000 characters or less.");
        }
        return content;
    }

    private int normalizePage(Integer page) {
        if (page == null) {
            return DEFAULT_PAGE;
        }
        return Math.max(0, page);
    }

    private int normalizeSize(Integer size) {
        if (size == null) {
            return DEFAULT_SIZE;
        }
        return Math.max(1, Math.min(MAX_SIZE, size));
    }

    private String normalizeKeyword(String keyword) {
        if (keyword == null) {
            return null;
        }
        String trimmed = keyword.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String normalizeSort(String sort) {
        if (sort == null) {
            return SORT_LATEST;
        }
        String value = sort.trim().toLowerCase(Locale.ROOT);
        return SORT_POPULAR.equals(value) ? SORT_POPULAR : SORT_LATEST;
    }

    private String normalizeCommentSort(String sort) {
        if (sort == null) {
            return SORT_LATEST;
        }
        String value = sort.trim().toLowerCase(Locale.ROOT);
        return SORT_OLDEST.equals(value) ? SORT_OLDEST : SORT_LATEST;
    }

    private Set<Long> extractPostIds(List<BoardPost> posts) {
        return posts.stream().map(BoardPost::getId).collect(Collectors.toSet());
    }

    private Map<Long, String> buildUserNameMap(Set<Long> userIds) {
        if (userIds.isEmpty()) {
            return Collections.emptyMap();
        }
        return userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, User::getName));
    }

    private Map<Long, Long> buildCountMap(List<Object[]> rows) {
        Map<Long, Long> map = new HashMap<>();
        for (Object[] row : rows) {
            if (row == null || row.length < 2 || row[0] == null || row[1] == null) {
                continue;
            }
            map.put(((Number) row[0]).longValue(), ((Number) row[1]).longValue());
        }
        return map;
    }

    private static class ValidatedPost {
        private final String title;
        private final String content;

        private ValidatedPost(String title, String content) {
            this.title = title;
            this.content = content;
        }
    }

    @Getter
    public static class AttachmentDownload {
        private final Resource resource;
        private final String originalName;
        private final String contentType;

        public AttachmentDownload(Resource resource, String originalName, String contentType) {
            this.resource = resource;
            this.originalName = originalName;
            this.contentType = contentType;
        }
    }
}
