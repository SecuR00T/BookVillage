import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Edit3, Eye, FileUp, Search, Trash2, X } from "lucide-react";
import { api } from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import PageLayout from "@/components/PageLayout";

const POST_PAGE_SIZE = 10;
const COMMENT_PAGE_SIZE = 5;

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).replace("T", " ").slice(0, 16);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatSize = (bytes) => {
  const n = Number(bytes || 0);
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${n} B`;
};

const isPreviewableContentType = (contentType) => {
  const type = String(contentType || "").toLowerCase();
  return type.startsWith("image/") || type.includes("pdf") || type.startsWith("text/");
};

export default function Board() {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: POST_PAGE_SIZE,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [selectedId, setSelectedId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [myOnly, setMyOnly] = useState(false);
  const [sort, setSort] = useState("latest");

  const [comments, setComments] = useState([]);
  const [commentSort, setCommentSort] = useState("latest");
  const [commentPage, setCommentPage] = useState(0);
  const [commentPageInfo, setCommentPageInfo] = useState({
    page: 0,
    size: COMMENT_PAGE_SIZE,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [commentInput, setCommentInput] = useState("");
  const [commentEditId, setCommentEditId] = useState(null);
  const [commentEditInput, setCommentEditInput] = useState("");

  const [attachments, setAttachments] = useState([]);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [pendingFiles, setPendingFiles] = useState([]);

  const clearPreview = useCallback(() => {
    setPreview((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  useEffect(() => () => clearPreview(), [clearPreview]);

  useEffect(() => {
    if (!preview) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") clearPreview();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [preview, clearPreview]);

  useEffect(() => {
    setPage(0);
  }, [query, myOnly, sort]);

  useEffect(() => {
    setCommentPage(0);
    setCommentEditId(null);
    setCommentEditInput("");
    clearPreview();
  }, [selectedId, clearPreview]);

  useEffect(() => {
    setCommentPage(0);
  }, [commentSort]);

  const loadPosts = useCallback(async (targetPage) => {
    const safePage = Math.max(0, Number(targetPage || 0));
    setLoading(true);
    setError("");
    try {
      const data = await api.board.list(query, myOnly, sort, safePage, POST_PAGE_SIZE);
      const rows = data?.items || [];
      const totalPages = Number(data?.totalPages || 0);

      if (rows.length === 0 && safePage > 0 && totalPages > 0) {
        setPage(totalPages - 1);
        return;
      }

      setPosts(rows);
      setPageInfo({
        page: Number(data?.page ?? safePage),
        size: Number(data?.size ?? POST_PAGE_SIZE),
        totalElements: Number(data?.totalElements ?? 0),
        totalPages,
        hasNext: Boolean(data?.hasNext),
        hasPrevious: Boolean(data?.hasPrevious),
      });
      setSelectedId((prev) => (rows.some((row) => row.id === prev) ? prev : (rows[0]?.id ?? null)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "게시글 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [query, myOnly, sort]);

  const loadDetail = useCallback(async () => {
    if (!selectedId) {
      setSelectedPost(null);
      setAttachments([]);
      clearPreview();
      return;
    }

    setDetailLoading(true);
    try {
      const [post, attachmentRows] = await Promise.all([
        api.board.get(selectedId),
        api.board.listAttachments(selectedId),
      ]);
      const rows = attachmentRows || [];

      setSelectedPost(post || null);
      setAttachments(rows);
      setPreview((prev) => {
        if (!prev) return prev;
        if (rows.some((a) => a.id === prev.attachmentId)) return prev;
        if (prev.url) URL.revokeObjectURL(prev.url);
        return null;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "게시글 상세를 불러오지 못했습니다.");
    } finally {
      setDetailLoading(false);
    }
  }, [selectedId, clearPreview]);

  const loadComments = useCallback(async (targetPage) => {
    if (!selectedId) {
      setComments([]);
      setCommentPageInfo({
        page: 0,
        size: COMMENT_PAGE_SIZE,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
      });
      return;
    }

    const safePage = Math.max(0, Number(targetPage || 0));
    setCommentsLoading(true);
    try {
      const data = await api.board.listComments(selectedId, commentSort, safePage, COMMENT_PAGE_SIZE);
      const rows = data?.items || [];
      const totalPages = Number(data?.totalPages || 0);

      if (rows.length === 0 && safePage > 0 && totalPages > 0) {
        setCommentPage(totalPages - 1);
        return;
      }

      setComments(rows);
      setCommentPageInfo({
        page: Number(data?.page ?? safePage),
        size: Number(data?.size ?? COMMENT_PAGE_SIZE),
        totalElements: Number(data?.totalElements ?? 0),
        totalPages,
        hasNext: Boolean(data?.hasNext),
        hasPrevious: Boolean(data?.hasPrevious),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "댓글을 불러오지 못했습니다.");
    } finally {
      setCommentsLoading(false);
    }
  }, [selectedId, commentSort]);

  useEffect(() => {
    loadPosts(page);
  }, [loadPosts, page]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  useEffect(() => {
    loadComments(commentPage);
  }, [loadComments, commentPage]);

  const clearPostForm = () => {
    setEditingId(null);
    setFormTitle("");
    setFormContent("");
    setPendingFiles([]);
  };

  const appendPendingFiles = (files) => {
    const rows = Array.from(files || []);
    if (!rows.length) return;
    setPendingFiles((prev) => {
      const next = [...prev];
      rows.forEach((file) => {
        const duplicated = next.some(
          (candidate) =>
            candidate.name === file.name &&
            candidate.size === file.size &&
            candidate.lastModified === file.lastModified,
        );
        if (!duplicated) {
          next.push(file);
        }
      });
      return next;
    });
  };

  const removePendingFile = (targetIndex) => {
    setPendingFiles((prev) => prev.filter((_, index) => index !== targetIndex));
  };

  const onSearch = (e) => {
    e.preventDefault();
    setQuery(queryInput.trim());
  };

  const startEditPost = (post) => {
    setEditingId(post.id);
    setFormTitle(post.title || "");
    setFormContent(post.content || "");
    setError("");
    setMessage("");
  };

  const submitPost = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!formTitle.trim()) {
      setError("제목을 입력해 주세요.");
      return;
    }
    if (!formContent.trim()) {
      setError("내용을 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const wasEditing = Boolean(editingId);
      const payload = { title: formTitle, content: formContent };
      const saved = editingId
        ? await api.board.update(editingId, payload)
        : await api.board.create(payload);

      let uploadedCount = 0;
      let uploadFailedCount = 0;
      if (!wasEditing && saved?.id && pendingFiles.length > 0) {
        for (const file of pendingFiles) {
          try {
            await api.board.uploadAttachment(saved.id, file);
            uploadedCount += 1;
          } catch {
            uploadFailedCount += 1;
          }
        }
      }

      clearPostForm();
      if (wasEditing) {
        setMessage("게시글이 수정되었습니다.");
      } else if (uploadedCount > 0) {
        setMessage(`게시글과 첨부파일 ${uploadedCount}개가 등록되었습니다.`);
      } else {
        setMessage("게시글이 등록되었습니다.");
      }
      if (uploadFailedCount > 0) {
        setError(`게시글은 등록되었지만 첨부파일 ${uploadFailedCount}개 업로드에 실패했습니다.`);
      }

      const targetPage = wasEditing ? page : 0;
      if (!wasEditing) setPage(0);
      await loadPosts(targetPage);
      if (saved?.id) setSelectedId(saved.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "게시글 저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const removePost = async (post) => {
    if (!post) return;
    if (!window.confirm("이 게시글을 삭제할까요?")) return;
    setError("");
    setMessage("");
    try {
      await api.board.delete(post.id);
      if (editingId === post.id) clearPostForm();
      setMessage("게시글이 삭제되었습니다.");
      await loadPosts(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "게시글 삭제에 실패했습니다.");
    }
  };

  const submitComment = async () => {
    if (!selectedId) return;
    if (!commentInput.trim()) {
      setError("댓글 내용을 입력해 주세요.");
      return;
    }
    setError("");
    setMessage("");
    try {
      await api.board.createComment(selectedId, commentInput.trim());
      setCommentInput("");
      setCommentPage(0);
      await Promise.all([loadComments(0), loadPosts(page), loadDetail()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "댓글 등록에 실패했습니다.");
    }
  };

  const startEditComment = (comment) => {
    setCommentEditId(comment.id);
    setCommentEditInput(comment.content || "");
  };

  const saveEditComment = async () => {
    if (!commentEditId) return;
    if (!commentEditInput.trim()) {
      setError("댓글 내용을 입력해 주세요.");
      return;
    }
    setError("");
    setMessage("");
    try {
      await api.board.updateComment(commentEditId, commentEditInput.trim());
      setCommentEditId(null);
      setCommentEditInput("");
      await Promise.all([loadComments(commentPage), loadPosts(page), loadDetail()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "댓글 수정에 실패했습니다.");
    }
  };

  const removeComment = async (commentId) => {
    if (!window.confirm("이 댓글을 삭제할까요?")) return;
    setError("");
    setMessage("");
    try {
      await api.board.deleteComment(commentId);
      if (commentEditId === commentId) {
        setCommentEditId(null);
        setCommentEditInput("");
      }
      await Promise.all([loadComments(commentPage), loadPosts(page), loadDetail()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "댓글 삭제에 실패했습니다.");
    }
  };

  const uploadAttachment = async (file) => {
    if (!selectedId || !file) return;
    setError("");
    setMessage("");
    setUploading(true);
    try {
      await api.board.uploadAttachment(selectedId, file);
      setMessage("첨부파일이 업로드되었습니다.");
      await Promise.all([loadDetail(), loadPosts(page)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "첨부파일 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = async (attachmentId) => {
    if (!selectedId) return;
    if (!window.confirm("이 첨부파일을 삭제할까요?")) return;
    setError("");
    setMessage("");
    try {
      await api.board.deleteAttachment(selectedId, attachmentId);
      setMessage("첨부파일이 삭제되었습니다.");
      await Promise.all([loadDetail(), loadPosts(page)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "첨부파일 삭제에 실패했습니다.");
    }
  };

  const downloadAttachment = async (attachment) => {
    if (!attachment) return;
    setError("");
    try {
      await api.board.downloadAttachment(attachment.id, attachment.originalName || "attachment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "첨부파일 다운로드에 실패했습니다.");
    }
  };

  const openPreview = async (attachment) => {
    if (!attachment) return;
    setError("");
    setMessage("");
    try {
      const { blob, filename, contentType } = await api.board.previewAttachment(attachment.id, attachment.originalName || "attachment");
      const type = String(contentType || "").toLowerCase();

      if (!isPreviewableContentType(type)) {
        throw new Error("이 파일 형식은 미리보기를 지원하지 않습니다.");
      }

      if (type.startsWith("text/")) {
        const text = await blob.text();
        setPreview((prev) => {
          if (prev?.url) URL.revokeObjectURL(prev.url);
          return {
            attachmentId: attachment.id,
            mode: "text",
            name: filename,
            text,
            url: null,
            contentType: type,
          };
        });
        return;
      }

      const url = URL.createObjectURL(blob);
      setPreview((prev) => {
        if (prev?.url) URL.revokeObjectURL(prev.url);
        return {
          attachmentId: attachment.id,
          mode: type.includes("pdf") ? "pdf" : "image",
          name: filename,
          text: "",
          url,
          contentType: type,
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "첨부파일 미리보기에 실패했습니다.");
    }
  };

  const selectedPostFromList = useMemo(
    () => posts.find((post) => post.id === selectedId) || null,
    [posts, selectedId],
  );
  const currentPost = (selectedPost && selectedPost.id === selectedId) ? selectedPost : selectedPostFromList;
  const isPostOwner = currentPost?.userId === user?.id;

  return (
    <PageLayout title="회원 게시판" description="로그인 회원 전용 게시판: 최신/인기 정렬, 댓글 정렬/페이징, 첨부 미리보기를 지원합니다.">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-4">
          <form onSubmit={onSearch} className="mb-3 flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px] flex-1">
              <input
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="제목/내용 검색"
                className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-primary"
              />
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary"
            >
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
            </select>
            <button type="submit" className="h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
              검색
            </button>
            <label className="ml-auto inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={myOnly}
                onChange={(e) => setMyOnly(e.target.checked)}
              />
              내 글만 보기
            </label>
          </form>

          {loading ? (
            <p className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground">목록을 불러오는 중입니다...</p>
          ) : posts.length === 0 ? (
            <p className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground">등록된 게시글이 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {posts.map((post) => (
                <button
                  type="button"
                  key={post.id}
                  onClick={() => setSelectedId(post.id)}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition-colors ${
                    selectedId === post.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:bg-secondary/60"
                  }`}
                >
                  <p className="truncate text-sm font-bold">{post.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{post.content}</p>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {post.authorName || "Unknown"} | {formatDateTime(post.createdAt)}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    댓글 {post.commentCount || 0} | 첨부 {post.attachmentCount || 0}
                  </p>
                </button>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
            <span>
              총 {pageInfo.totalElements}건 | {pageInfo.totalPages > 0 ? pageInfo.page + 1 : 0}/{pageInfo.totalPages} 페이지
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!pageInfo.hasPrevious}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="rounded-md border border-border px-2 py-1 disabled:opacity-40"
              >
                이전
              </button>
              <button
                type="button"
                disabled={!pageInfo.hasNext}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-border px-2 py-1 disabled:opacity-40"
              >
                다음
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="text-base font-bold">게시글 상세</h2>
            {!currentPost ? (
              <p className="mt-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                왼쪽 목록에서 게시글을 선택해 주세요.
              </p>
            ) : detailLoading ? (
              <p className="mt-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                상세 정보를 불러오는 중입니다...
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                <div className="rounded-xl border border-border bg-background px-3 py-3">
                  <p className="text-lg font-bold">{currentPost.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {currentPost.authorName || "Unknown"} | 작성 {formatDateTime(currentPost.createdAt)}
                    {currentPost.updatedAt && ` | 수정 ${formatDateTime(currentPost.updatedAt)}`}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{currentPost.content}</p>
                </div>

                {isPostOwner && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm hover:bg-secondary"
                      onClick={() => startEditPost(currentPost)}
                    >
                      <Edit3 size={14} />
                      수정
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-9 items-center gap-1 rounded-lg border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => removePost(currentPost)}
                    >
                      <Trash2 size={14} />
                      삭제
                    </button>
                  </div>
                )}

                <div className="rounded-xl border border-border bg-background px-3 py-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold">첨부파일</p>
                    {isPostOwner && (
                      <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs hover:bg-secondary">
                        <FileUp size={13} />
                        업로드
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            if (file) uploadAttachment(file);
                            e.target.value = "";
                          }}
                          disabled={uploading}
                        />
                      </label>
                    )}
                  </div>
                  {attachments.length === 0 ? (
                    <p className="text-xs text-muted-foreground">첨부파일이 없습니다.</p>
                  ) : (
                    <div className="space-y-2">
                      {attachments.map((a) => (
                        <div key={a.id} className="rounded-lg border border-border px-2 py-2 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate font-medium" title={a.originalName}>{a.originalName}</p>
                            <span className="text-muted-foreground">{formatSize(a.fileSize)}</span>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 hover:bg-secondary"
                              onClick={() => openPreview(a)}
                            >
                              <Eye size={12} />
                              미리보기
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 hover:bg-secondary"
                              onClick={() => downloadAttachment(a)}
                            >
                              <Download size={12} />
                              다운로드
                            </button>
                            {isPostOwner && (
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50"
                                onClick={() => removeAttachment(a.id)}
                              >
                                <Trash2 size={12} />
                                삭제
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-border bg-background px-3 py-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold">댓글</p>
                    <select
                      value={commentSort}
                      onChange={(e) => setCommentSort(e.target.value)}
                      className="h-8 rounded-lg border border-input bg-background px-2 text-xs outline-none focus:border-primary"
                    >
                      <option value="latest">최신순</option>
                      <option value="oldest">오래된순</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="댓글을 입력하세요"
                      className="h-9 flex-1 rounded-lg border border-input px-3 text-sm outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={submitComment}
                      className="h-9 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground"
                    >
                      등록
                    </button>
                  </div>

                  {commentsLoading ? (
                    <p className="mt-2 text-xs text-muted-foreground">댓글을 불러오는 중입니다...</p>
                  ) : comments.length === 0 ? (
                    <p className="mt-2 text-xs text-muted-foreground">등록된 댓글이 없습니다.</p>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {comments.map((c) => (
                        <div key={c.id} className="rounded-lg border border-border px-2 py-2">
                          <p className="text-[11px] text-muted-foreground">
                            {c.authorName || "Unknown"} | {formatDateTime(c.createdAt)}
                          </p>
                          {commentEditId === c.id ? (
                            <div className="mt-1 flex items-center gap-2">
                              <input
                                value={commentEditInput}
                                onChange={(e) => setCommentEditInput(e.target.value)}
                                className="h-8 flex-1 rounded-md border border-input px-2 text-xs outline-none focus:border-primary"
                              />
                              <button type="button" className="text-xs text-primary" onClick={saveEditComment}>저장</button>
                              <button
                                type="button"
                                className="text-xs text-muted-foreground"
                                onClick={() => {
                                  setCommentEditId(null);
                                  setCommentEditInput("");
                                }}
                              >
                                취소
                              </button>
                            </div>
                          ) : (
                            <p className="mt-1 whitespace-pre-wrap text-sm">{c.content}</p>
                          )}

                          {c.userId === user?.id && commentEditId !== c.id && (
                            <div className="mt-1 flex items-center gap-2 text-xs">
                              <button type="button" className="text-primary" onClick={() => startEditComment(c)}>수정</button>
                              <button type="button" className="text-red-500" onClick={() => removeComment(c.id)}>삭제</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      댓글 {commentPageInfo.totalElements}개 | {commentPageInfo.totalPages > 0 ? commentPageInfo.page + 1 : 0}/{commentPageInfo.totalPages} 페이지
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={!commentPageInfo.hasPrevious}
                        onClick={() => setCommentPage((p) => Math.max(0, p - 1))}
                        className="rounded-md border border-border px-2 py-1 disabled:opacity-40"
                      >
                        이전
                      </button>
                      <button
                        type="button"
                        disabled={!commentPageInfo.hasNext}
                        onClick={() => setCommentPage((p) => p + 1)}
                        className="rounded-md border border-border px-2 py-1 disabled:opacity-40"
                      >
                        다음
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="text-base font-bold">{editingId ? "게시글 수정" : "게시글 작성"}</h2>
            <form onSubmit={submitPost} className="mt-3 space-y-2">
              <input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="제목"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="내용"
                rows={6}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              {editingId ? (
                <p className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                  첨부파일은 상단 상세영역에서 직접 업로드/삭제할 수 있습니다.
                </p>
              ) : (
                <div className="rounded-xl border border-border bg-background px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground">첨부파일 (작성과 동시에 업로드)</p>
                    <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs hover:bg-secondary">
                      <FileUp size={13} />
                      파일 추가
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          appendPendingFiles(e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>

                  {pendingFiles.length === 0 ? (
                    <p className="mt-2 text-xs text-muted-foreground">선택된 파일이 없습니다.</p>
                  ) : (
                    <div className="mt-2 space-y-1">
                      {pendingFiles.map((file, index) => (
                        <div key={`${file.name}-${file.size}-${file.lastModified}`} className="flex items-center justify-between rounded-lg border border-border px-2 py-1.5 text-xs">
                          <p className="truncate pr-2">{file.name}</p>
                          <button
                            type="button"
                            className="text-red-600 hover:underline"
                            onClick={() => removePendingFile(index)}
                          >
                            제거
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {submitting ? "저장 중..." : (editingId ? "수정 완료" : "작성 완료")}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={clearPostForm}
                    className="h-10 rounded-xl border border-border px-4 text-sm hover:bg-secondary"
                  >
                    취소
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>
      </div>

      {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {message && <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}

      {preview && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center p-4 sm:p-8">
          <button type="button" className="absolute inset-0 bg-black/60" onClick={clearPreview} />
          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{preview.name}</p>
                <p className="text-xs text-muted-foreground">{preview.contentType || "preview"}</p>
              </div>
              <button
                type="button"
                className="rounded-md border border-border p-1.5 hover:bg-secondary"
                onClick={clearPreview}
              >
                <X size={14} />
              </button>
            </div>
            <div className="max-h-[calc(88vh-58px)] overflow-auto bg-background p-4">
              {preview.mode === "image" && (
                <img src={preview.url} alt={preview.name} className="mx-auto max-h-[74vh] w-auto rounded-lg border border-border" />
              )}
              {preview.mode === "pdf" && (
                <iframe src={preview.url} title={preview.name} className="h-[74vh] w-full rounded-lg border border-border bg-white" />
              )}
              {preview.mode === "text" && (
                <pre className="max-h-[74vh] overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-card p-3 text-xs">{preview.text}</pre>
              )}
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
