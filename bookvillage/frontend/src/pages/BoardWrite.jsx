import { useEffect, useMemo, useState } from "react";
import { FileUp, Save, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/api/client";
import PageLayout from "@/components/PageLayout";

const parseId = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

export default function BoardWrite() {
  const { postId: postIdParam } = useParams();
  const navigate = useNavigate();

  const postId = parseId(postIdParam);
  const isEdit = useMemo(() => Boolean(postId), [postId]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pendingFiles, setPendingFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isEdit || !postId) return;
    let active = true;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const post = await api.board.get(postId);
        if (!active) return;
        setTitle(post?.title || "");
        setContent(post?.content || "");
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "게시글 정보를 불러오지 못했습니다.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [isEdit, postId]);

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
        if (!duplicated) next.push(file);
      });
      return next;
    });
  };

  const removePendingFile = (targetIndex) => {
    setPendingFiles((prev) => prev.filter((_, index) => index !== targetIndex));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!title.trim()) {
      setError("제목을 입력해 주세요.");
      return;
    }
    if (!content.trim()) {
      setError("내용을 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit && postId) {
        await api.board.update(postId, { title, content });
        navigate(`/board/${postId}`, { state: { message: "게시글이 수정되었습니다." } });
        return;
      }

      const saved = await api.board.create({ title, content });
      const savedId = Number(saved?.id || 0);

      let uploadedCount = 0;
      let uploadFailedCount = 0;

      if (savedId > 0 && pendingFiles.length > 0) {
        for (const file of pendingFiles) {
          try {
            await api.board.uploadAttachment(savedId, file);
            uploadedCount += 1;
          } catch {
            uploadFailedCount += 1;
          }
        }
      }

      const successMessage = uploadFailedCount > 0
        ? `게시글은 등록되었습니다. 첨부 ${uploadedCount}개 업로드 성공, ${uploadFailedCount}개 실패`
        : uploadedCount > 0
          ? `게시글과 첨부 ${uploadedCount}개가 등록되었습니다.`
          : "게시글이 등록되었습니다.";

      if (savedId > 0) {
        navigate(`/board/${savedId}`, { state: { message: successMessage } });
      } else {
        navigate("/board", { state: { message: successMessage } });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "게시글 저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && !postId) {
    return (
      <PageLayout hideIntro>
        <div className="rounded-2xl border border-red-200 bg-card p-6">
          <p className="text-sm font-semibold text-red-600">올바르지 않은 수정 경로입니다.</p>
          <button
            type="button"
            onClick={() => navigate("/board")}
            className="mt-3 h-10 rounded-xl border border-border px-4 text-sm hover:bg-secondary"
          >
            목록으로
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={isEdit ? "게시글 수정" : "게시글 작성"} description={isEdit ? "게시글 내용을 수정합니다." : "새 게시글을 작성합니다."}>
      <section className="rounded-2xl border border-border bg-card p-4">
        {loading ? (
          <p className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground">게시글 정보를 불러오는 중입니다...</p>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용"
              rows={10}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />

            {isEdit ? (
              <p className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                첨부파일은 상세 페이지에서 관리할 수 있습니다.
              </p>
            ) : (
              <div className="rounded-xl border border-border bg-background px-3 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground">첨부파일 (작성 시 함께 업로드)</p>
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
                  <p className="mt-2 text-xs text-muted-foreground">선택한 파일이 없습니다.</p>
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
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                <Save size={14} />
                {submitting ? "저장 중..." : (isEdit ? "수정 완료" : "작성 완료")}
              </button>
              <button
                type="button"
                onClick={() => navigate(isEdit ? `/board/${postId}` : "/board")}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm hover:bg-secondary"
              >
                <X size={14} />
                취소
              </button>
            </div>
          </form>
        )}
      </section>

      {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {message && <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
    </PageLayout>
  );
}
