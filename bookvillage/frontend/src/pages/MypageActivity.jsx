import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { api } from "@/api/client";
import PageLayout from "@/components/PageLayout";

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
  return d.toLocaleDateString("ko-KR");
};

const extractBookId = (row) => {
  const raw = row?.bookId ?? row?.book_id ?? row?.bookid;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export default function MypageActivity() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [recentViews, setRecentViews] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [includePrivateFavorite, setIncludePrivateFavorite] = useState(false);
  const [myReviews, setMyReviews] = useState([]);
  const [reviewDrafts, setReviewDrafts] = useState({});

  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [savingReviewId, setSavingReviewId] = useState(null);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");

    const [rv, ws, fp, mr] = await Promise.allSettled([
      api.mypage.recentViews(),
      api.mypage.wishlist(),
      api.mypage.favoritePosts(includePrivateFavorite),
      api.mypage.myReviews(),
    ]);

    setRecentViews(rv.status === "fulfilled" ? rv.value || [] : []);
    setWishlist(ws.status === "fulfilled" ? ws.value || [] : []);
    setFavoritePosts(fp.status === "fulfilled" ? fp.value || [] : []);
    const loadedReviews = mr.status === "fulfilled" ? mr.value || [] : [];
    setMyReviews(loadedReviews);
    setReviewDrafts((prev) => {
      const next = {};
      loadedReviews.forEach((review) => {
        const existing = prev[review.id];
        next[review.id] = {
          rating: Number(existing?.rating ?? review.rating ?? 5),
          content: existing?.content ?? review.content ?? "",
        };
      });
      return next;
    });

    if ([rv, ws, fp, mr].some((result) => result.status === "rejected")) {
      setError("일부 활동 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [includePrivateFavorite]);

  const removeWishlist = async (wishlistId) => {
    setActionError("");
    setActionMessage("");
    try {
      await api.mypage.removeWishlist(wishlistId);
      setActionMessage("찜 목록에서 삭제했습니다.");
      await loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "찜 삭제에 실패했습니다.");
    }
  };

  const removeFavoritePost = async (postId) => {
    setActionError("");
    setActionMessage("");
    try {
      await api.mypage.deleteFavoritePost(postId);
      setActionMessage("관심 게시글에서 삭제했습니다.");
      await loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "관심 게시글 삭제에 실패했습니다.");
    }
  };

  const changeReviewDraft = (reviewId, key, value) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [reviewId]: {
        rating: Number(prev[reviewId]?.rating ?? 5),
        content: prev[reviewId]?.content ?? "",
        [key]: value,
      },
    }));
  };

  const saveMyReview = async (reviewId) => {
    const draft = reviewDrafts[reviewId];
    const nextContent = String(draft?.content || "").trim();
    const nextRating = Number(draft?.rating ?? 0);
    setActionError("");
    setActionMessage("");

    if (!nextContent) {
      setActionError("리뷰 내용을 입력해 주세요.");
      return;
    }
    if (!Number.isInteger(nextRating) || nextRating < 1 || nextRating > 5) {
      setActionError("평점은 1~5 사이여야 합니다.");
      return;
    }

    setSavingReviewId(reviewId);
    try {
      await api.mypage.updateReview(reviewId, { rating: nextRating, content: nextContent });
      setActionMessage("리뷰가 수정되었습니다.");
      await loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "리뷰 수정에 실패했습니다.");
    } finally {
      setSavingReviewId(null);
    }
  };

  const deleteMyReview = async (reviewId) => {
    setActionError("");
    setActionMessage("");
    if (!window.confirm("선택한 리뷰를 삭제할까요?")) {
      return;
    }

    setDeletingReviewId(reviewId);
    try {
      await api.mypage.deleteReview(reviewId, `mypage-review-${reviewId}`);
      setActionMessage("리뷰가 삭제되었습니다.");
      await loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "리뷰 삭제에 실패했습니다.");
    } finally {
      setDeletingReviewId(null);
    }
  };

  if (loading) {
    return (
      <PageLayout hideIntro>
        <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          <Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin" />
          활동 정보를 불러오는 중입니다.
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="활동 관리" description="최근 조회, 찜 목록, 관심 게시글, 내가 작성한 리뷰를 관리합니다.">
      <section className="mx-auto max-w-6xl space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/mypage" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary">
            마이페이지 홈
          </Link>
          <Link to="/mypage/account" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary">
            계정 관리
          </Link>
          <Link to="/mypage/wallet" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary">
            포인트/쿠폰
          </Link>
        </div>

        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        {actionError && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{actionError}</p>}
        {actionMessage && <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{actionMessage}</p>}

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-bold">최근 조회</h2>
          {recentViews.length === 0 ? (
            <p className="rounded-xl bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">최근 조회한 도서가 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {recentViews.slice(0, 30).map((rv) => {
                const bookId = extractBookId(rv);
                return (
                  <div key={rv.id} className="rounded-xl border border-border bg-background/80 px-3 py-2">
                    <p className="text-sm font-semibold">
                      {bookId ? (
                        <Link to={`/book/${bookId}`} className="hover:text-primary hover:underline">
                          {rv.title || rv.bookTitle || rv.book_title || `BOOK #${bookId}`}
                        </Link>
                      ) : (
                        rv.title || rv.bookTitle || rv.book_title || "도서 정보 없음"
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {rv.author || "-"} | {formatDate(rv.viewedAt)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-bold">찜 목록</h2>
          {wishlist.length === 0 ? (
            <p className="rounded-xl bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">찜한 도서가 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {wishlist.slice(0, 50).map((w) => {
                const bookId = extractBookId(w);
                return (
                  <div key={w.id} className="flex items-center justify-between rounded-xl border border-border bg-background/80 px-3 py-2">
                    <p className="mr-3 text-sm font-medium">
                      {bookId ? (
                        <Link to={`/book/${bookId}`} className="hover:text-primary hover:underline">
                          {w.title || w.bookTitle || w.book_title || `BOOK #${bookId}`}
                        </Link>
                      ) : (
                        w.title || w.bookTitle || w.book_title || "도서 정보 없음"
                      )}
                    </p>
                    <button className="text-xs font-semibold text-red-500 hover:text-red-600" onClick={() => removeWishlist(w.id)}>
                      삭제
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">관심 게시글</h2>
            <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={includePrivateFavorite}
                onChange={(e) => setIncludePrivateFavorite(e.target.checked)}
              />
              비공개 포함
            </label>
          </div>
          {favoritePosts.length === 0 ? (
            <p className="rounded-xl bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">관심 게시글이 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {favoritePosts.slice(0, 50).map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl border border-border bg-background/80 px-3 py-2">
                  <div className="mr-3">
                    <p className="text-sm font-medium">{p.postTitle}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(p.createdAt)}</p>
                  </div>
                  <button className="text-xs font-semibold text-red-500 hover:text-red-600" onClick={() => removeFavoritePost(p.id)}>
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-bold">나의 리뷰 관리</h2>
          {myReviews.length === 0 ? (
            <p className="rounded-xl bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">작성한 리뷰가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {myReviews.slice(0, 50).map((review) => {
                const draft = reviewDrafts[review.id] || { rating: Number(review.rating || 5), content: review.content || "" };
                const reviewBookId = extractBookId(review);
                return (
                  <div key={review.id} className="rounded-xl border border-border bg-background/80 p-3">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                      <Link to={`/book/${reviewBookId || review.bookId}`} className="font-semibold hover:text-primary hover:underline">
                        {review.bookTitle || review.book_title || (reviewBookId ? `BOOK #${reviewBookId}` : `BOOK #${review.bookId}`)}
                      </Link>
                      <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-[120px_1fr]">
                      <label className="text-xs text-muted-foreground">
                        평점
                        <select
                          className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
                          value={String(draft.rating)}
                          onChange={(e) => changeReviewDraft(review.id, "rating", Number(e.target.value))}
                        >
                          {[1, 2, 3, 4, 5].map((score) => (
                            <option key={score} value={score}>
                              {score}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="text-xs text-muted-foreground">
                        리뷰 내용
                        <textarea
                          className="mt-1 h-24 w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
                          value={draft.content}
                          onChange={(e) => changeReviewDraft(review.id, "content", e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => saveMyReview(review.id)}
                        disabled={savingReviewId === review.id}
                        className="inline-flex h-9 items-center rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
                      >
                        {savingReviewId === review.id ? "처리 중..." : "리뷰 수정"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMyReview(review.id)}
                        disabled={deletingReviewId === review.id}
                        className="inline-flex h-9 items-center rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        {deletingReviewId === review.id ? "처리 중..." : "리뷰 삭제"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </PageLayout>
  );
}
