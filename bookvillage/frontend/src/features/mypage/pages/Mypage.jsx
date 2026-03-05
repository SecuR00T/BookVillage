import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Clock3,
  Heart,
  KeyRound,
  Loader2,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  Save,
  ShieldCheck,
  Ticket,
  Trash2,
  UserRound,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/api/client";
import PageLayout from "@/components/PageLayout";

const TEXT = {
  loading: "마이페이지 정보를 불러오는 중입니다.",
  title: "마이페이지",
  subtitle: "회원 정보, 보관함, 활동 기록을 한 곳에서 관리하세요.",
  profile: "프로필 정보",
  profileHint: "기본 정보를 수정하고 저장할 수 있습니다.",
  email: "이메일",
  name: "이름",
  phone: "연락처",
  address: "주소",
  save: "프로필 저장",
  saveDone: "프로필이 저장되었습니다.",
  saveFail: "프로필 저장에 실패했습니다.",
  security: "보안 설정",
  securityHint: "비밀번호 변경을 통해 계정 보안을 유지하세요.",
  currentPassword: "현재 비밀번호",
  newPassword: "새 비밀번호",
  confirmPassword: "새 비밀번호 확인",
  pwUpdate: "비밀번호 변경",
  pwDone: "비밀번호가 변경되었습니다.",
  pwFillAll: "비밀번호 항목을 모두 입력해 주세요.",
  pwMin: "새 비밀번호는 8자 이상이어야 합니다.",
  pwNotMatch: "새 비밀번호 확인이 일치하지 않습니다.",
  pwFail: "비밀번호 변경에 실패했습니다.",
  processing: "처리 중...",
  danger: "계정 탈퇴",
  dangerHint: "탈퇴 시 계정 및 활동 기록이 삭제됩니다.",
  deleteConfirmPw: "비밀번호 확인",
  deleteButton: "계정 탈퇴",
  deleteNeedPw: "비밀번호를 입력해 주세요.",
  deleteAsk: "계정을 정말로 삭제할까요? 복구할 수 없습니다.",
  deleteFail: "계정 삭제에 실패했습니다.",
  orders: "내 주문",
  emptyOrders: "주문 내역이 없습니다.",
  viewAllOrders: "주문 상세 보기",
  orderNumber: "주문번호",
  orderStatus: "상태",
  orderAmount: "금액",
  orderDate: "주문일",
  recentViews: "최근 조회",
  wishlist: "찜 목록",
  wallet: "지갑",
  favoritePosts: "관심 게시글",
  myReviews: "나의 리뷰 관리",
  emptyRecent: "최근 조회한 도서가 없습니다.",
  emptyWishlist: "찜한 도서가 없습니다.",
  emptyFavorite: "관심 게시글이 없습니다.",
  emptyMyReviews: "작성한 리뷰가 없습니다.",
  remove: "삭제",
  ratingLabel: "평점",
  reviewContentLabel: "리뷰 내용",
  reviewEditSave: "리뷰 수정",
  reviewDelete: "리뷰 삭제",
  reviewSaved: "리뷰가 수정되었습니다.",
  reviewDeleted: "리뷰가 삭제되었습니다.",
  reviewContentRequired: "리뷰 내용을 입력해 주세요.",
  reviewDeleteAsk: "선택한 리뷰를 삭제할까요?",
  reviewRatingRange: "평점은 1~5 사이여야 합니다.",
  reviewUpdateFail: "리뷰 수정에 실패했습니다.",
  reviewDeleteFail: "리뷰 삭제에 실패했습니다.",
  currentPoints: "현재 포인트",
  pointHistoryCount: "포인트 기록",
  couponCount: "보유 쿠폰",
  availableCoupons: "사용 가능 쿠폰",
  noCoupons: "사용 가능한 쿠폰이 없습니다.",
  pointHistoryTitle: "포인트 획득/사용 내역",
  couponHistoryTitle: "쿠폰 횟득/사용 내역",
  emptyPointHistory: "포인트 내역이 없습니다.",
  emptyCouponHistory: "쿠폰 내역이 없습니다.",
  historyType: "구분",
  historyAmount: "금액/혜택",
  historyDesc: "내용",
  historyDate: "일시",
  pointEarn: "포인트 획득",
  pointUse: "포인트 사용",
  pointDescPurchaseEarn: "도서 구매 적립",
  pointDescPurchaseUse: "도서 구매 시 포인트 사용",
  couponAcquire: "쿠폰 획득",
  couponUse: "쿠폰 사용",
  couponOrderNumber: "주문번호",
  recentCount: "최근 조회",
  wishlistCount: "찜 수",
  orderCount: "주문 수",
  refresh: "새로고침",
  viewMyInfo: "내 정보 보기",
  profileLoadFail: "회원 정보 조회에 실패했습니다.",
  ordersShortcut: "내 주문 보기",
  couponsShortcut: "쿠폰 확인",
  walletLoadFail: "쿠폰/포인트 데이터를 불러오지 못했습니다. 새로고침을 다시 시도해 주세요.",
  partialLoad: "일부 위젯 데이터를 불러오지 못했습니다. 새로고침으로 다시 시도해 주세요.",
};

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
  return d.toLocaleDateString("ko-KR");
};
const formatDateTime = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("ko-KR");
};

const formatMoney = (value) => Number(value || 0).toLocaleString("ko-KR");
const formatPointHistoryDescription = (description, amount) => {
  const normalized = String(description || "").trim().toLowerCase();
  if (!normalized) {
    return Number(amount || 0) >= 0 ? TEXT.pointDescPurchaseEarn : TEXT.pointDescPurchaseUse;
  }
  if (normalized === "checkout reward") return TEXT.pointDescPurchaseEarn;
  if (normalized === "checkout point use") return TEXT.pointDescPurchaseUse;
  return description;
};

const extractBookId = (row) => {
  const raw = row?.bookId ?? row?.book_id ?? row?.bookid;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const ShortcutCard = ({ icon: Icon, label, value, description, to }) => (
  <Link
    to={to}
    className="block w-full rounded-2xl border border-border bg-background/70 p-4 text-left transition-colors hover:bg-background"
  >
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon size={15} />
      <p className="text-xs font-medium">{label}</p>
    </div>
    {value !== undefined && <p className="mt-2 text-2xl font-extrabold">{value}</p>}
    {description && <p className="mt-2 text-xs text-muted-foreground">{description}</p>}
  </Link>
);

export default function Mypage() {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [edit, setEdit] = useState({ name: "", phone: "", address: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [changingPw, setChangingPw] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [recentViews, setRecentViews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [includePrivateFavorite, setIncludePrivateFavorite] = useState(false);
  const [myReviews, setMyReviews] = useState([]);
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [reviewActionError, setReviewActionError] = useState("");
  const [reviewActionMessage, setReviewActionMessage] = useState("");
  const [savingReviewId, setSavingReviewId] = useState(null);
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [summaryFromServer, setSummaryFromServer] = useState(null);
  const [extrasError, setExtrasError] = useState("");
  const [walletLoadError, setWalletLoadError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadExtras = async () => {
    setRefreshing(true);
    setExtrasError("");
    setWalletLoadError("");

    const [sm, rv, od, ws, wl, mr, fp] = await Promise.allSettled([
      api.mypage.summary(),
      api.mypage.recentViews(),
      api.orders.list(),
      api.mypage.wishlist(),
      api.mypage.wallet(),
      api.mypage.myReviews(),
      api.mypage.favoritePosts(includePrivateFavorite),
    ]);

    setSummaryFromServer(sm.status === "fulfilled" ? sm.value || null : null);
    setRecentViews(rv.status === "fulfilled" ? rv.value || [] : []);
    setOrders(od.status === "fulfilled" ? od.value || [] : []);
    setWishlist(ws.status === "fulfilled" ? ws.value || [] : []);
    setWallet(wl.status === "fulfilled" ? wl.value || null : null);
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
    setFavoritePosts(fp.status === "fulfilled" ? fp.value || [] : []);
    setWalletLoadError(wl.status === "rejected" ? TEXT.walletLoadFail : "");

    if ([sm, rv, od, ws, wl, mr, fp].some((result) => result.status === "rejected")) {
      setExtrasError(TEXT.partialLoad);
    }

    setRefreshing(false);
  };

  const loadMyProfile = async () => {
    if (!user?.id) return;
    setProfileErr("");
    setProfileMsg("");
    setProfileLoading(true);
    try {
      const u = await api.users.get(Number(user.id));
      setProfile(u);
      setEdit({ name: u.name || "", phone: u.phone || "", address: u.address || "" });
    } catch (err) {
      setProfile(null);
      setProfileErr(err instanceof Error ? err.message : TEXT.profileLoadFail);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    let active = true;

    (async () => {
      await loadMyProfile();
      if (active) {
        await loadExtras();
      }
    })();

    return () => {
      active = false;
    };
  }, [user?.id]);
  useEffect(() => {
    if (!user?.id) return;
    loadExtras();
  }, [includePrivateFavorite]);

  const save = async () => {
    if (!profile?.id) return;
    setProfileErr("");
    setProfileMsg("");
    setSavingProfile(true);
    try {
      const updated = await api.users.update(profile.id, edit);
      setProfile(updated);
      setProfileMsg(TEXT.saveDone);
    } catch (err) {
      setProfileErr(err instanceof Error ? err.message : TEXT.saveFail);
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async () => {
    setPwError("");
    setPwSuccess("");
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      setPwError(TEXT.pwFillAll);
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError(TEXT.pwMin);
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError(TEXT.pwNotMatch);
      return;
    }

    setChangingPw(true);
    try {
      await api.users.changePassword(pwForm.currentPassword, pwForm.newPassword);
      setPwSuccess(TEXT.pwDone);
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwError(err instanceof Error ? err.message : TEXT.pwFail);
    } finally {
      setChangingPw(false);
    }
  };

  const removeAccount = async () => {
    if (!deletePassword.trim()) {
      setDeleteError(TEXT.deleteNeedPw);
      return;
    }
    if (!window.confirm(TEXT.deleteAsk)) {
      return;
    }

    setDeleteError("");
    setDeleting(true);
    try {
      await deleteAccount(deletePassword);
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : TEXT.deleteFail);
    } finally {
      setDeleting(false);
      setDeletePassword("");
    }
  };

  const removeWishlist = async (wishlistId) => {
    await api.mypage.removeWishlist(wishlistId);
    await loadExtras();
  };

  const removeFavoritePost = async (postId) => {
    await api.mypage.deleteFavoritePost(postId);
    await loadExtras();
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
    setReviewActionError("");
    setReviewActionMessage("");

    if (!nextContent) {
      setReviewActionError(TEXT.reviewContentRequired);
      return;
    }
    if (!Number.isInteger(nextRating) || nextRating < 1 || nextRating > 5) {
      setReviewActionError(TEXT.reviewRatingRange);
      return;
    }

    setSavingReviewId(reviewId);
    try {
      await api.mypage.updateReview(reviewId, { rating: nextRating, content: nextContent });
      setReviewActionMessage(TEXT.reviewSaved);
      await loadExtras();
    } catch (err) {
      setReviewActionError(err instanceof Error ? err.message : TEXT.reviewUpdateFail);
    } finally {
      setSavingReviewId(null);
    }
  };

  const deleteMyReview = async (reviewId) => {
    setReviewActionError("");
    setReviewActionMessage("");
    if (!window.confirm(TEXT.reviewDeleteAsk)) {
      return;
    }

    setDeletingReviewId(reviewId);
    try {
      await api.mypage.deleteReview(reviewId, `mypage-review-${reviewId}`);
      setReviewActionMessage(TEXT.reviewDeleted);
      await loadExtras();
    } catch (err) {
      setReviewActionError(err instanceof Error ? err.message : TEXT.reviewDeleteFail);
    } finally {
      setDeletingReviewId(null);
    }
  };

  const summary = useMemo(
    () => ({
      recentCount: Number(summaryFromServer?.recentCount ?? recentViews.length),
      orderCount: Number(orders.length),
      wishlistCount: Number(summaryFromServer?.wishlistCount ?? wishlist.length),
      currentPoints: Number(summaryFromServer?.currentPoints ?? wallet?.currentPoints ?? 0),
      couponCount: Number(summaryFromServer?.couponCount ?? (wallet?.coupons || []).length),
      pointHistoryCount: Number(summaryFromServer?.pointHistoryCount ?? (wallet?.pointHistories || []).length),
    }),
    [summaryFromServer, recentViews, orders, wishlist, wallet],
  );
  const pointHistories = useMemo(() => wallet?.pointHistories || [], [wallet]);
  const couponHistories = useMemo(() => {
    const acquired = (wallet?.coupons || []).map((coupon) => ({
      key: `acquire-${coupon.code}`,
      actionType: "ACQUIRE",
      couponCode: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      createdAt: coupon.createdAt || coupon.validFrom || null,
      orderNumber: null,
    }));
    const used = (wallet?.couponHistories || []).map((row) => ({
      key: `use-${row.id || row.couponCode}-${row.usedAt}`,
      actionType: "USE",
      couponCode: row.couponCode,
      discountType: null,
      discountValue: null,
      createdAt: row.usedAt,
      orderNumber: row.orderNumber || null,
    }));
    return [...used, ...acquired].sort((a, b) => {
      const aTs = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTs = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTs - aTs;
    });
  }, [wallet]);

  const sectionKey = useMemo(() => {
    const path = location.pathname.replace(/^\/mypage\/?/, "");
    const first = path.split("/")[0] || "";
    return first;
  }, [location.pathname]);

  const sectionTitles = {
    security: TEXT.security,
    recent: TEXT.recentViews,
    wishlist: TEXT.wishlist,
    reviews: TEXT.myReviews,
    orders: TEXT.orders,
    wallet: TEXT.wallet,
    favorites: TEXT.favoritePosts,
  };

  const isMainView = sectionKey === "";
  const isKnownSection = isMainView || Boolean(sectionTitles[sectionKey]);

  const shortcuts = [
    {
      key: "security",
      to: "/mypage/security",
      icon: ShieldCheck,
      label: TEXT.security,
      description: TEXT.securityHint,
    },
    {
      key: "recent",
      to: "/mypage/recent",
      icon: Clock3,
      label: TEXT.recentViews,
      value: summary.recentCount,
    },
    {
      key: "wishlist",
      to: "/mypage/wishlist",
      icon: Heart,
      label: TEXT.wishlist,
      value: summary.wishlistCount,
    },
    {
      key: "reviews",
      to: "/mypage/reviews",
      icon: PencilLine,
      label: TEXT.myReviews,
      value: myReviews.length,
    },
    {
      key: "orders",
      to: "/mypage/orders",
      icon: Ticket,
      label: TEXT.orders,
      value: summary.orderCount,
    },
    {
      key: "wallet",
      to: "/mypage/wallet",
      icon: Wallet,
      label: TEXT.wallet,
      value: summary.currentPoints.toLocaleString(),
    },
    {
      key: "favorites",
      to: "/mypage/favorites",
      icon: Heart,
      label: TEXT.favoritePosts,
      value: favoritePosts.length,
    },
  ];

  const renderSubpageSection = () => {
    switch (sectionKey) {
      case "security":
        return (
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              <h2 className="text-lg font-bold">{TEXT.security}</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">{TEXT.securityHint}</p>

            <div className="space-y-3">
              <input
                type="password"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                placeholder={TEXT.currentPassword}
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              />
              <input
                type="password"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                placeholder={TEXT.newPassword}
                value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              />
              <input
                type="password"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                placeholder={TEXT.confirmPassword}
                value={pwForm.confirmPassword}
                onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
              />
            </div>

            {pwError && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{pwError}</p>}
            {pwSuccess && <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{pwSuccess}</p>}

            <button
              type="button"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
              onClick={changePassword}
              disabled={changingPw}
            >
              <KeyRound size={14} />
              {changingPw ? TEXT.processing : TEXT.pwUpdate}
            </button>
          </section>
        );

      case "recent":
        return (
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-4 text-lg font-bold">{TEXT.recentViews}</h2>
            {recentViews.length === 0 ? (
              <p className="rounded-xl bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">{TEXT.emptyRecent}</p>
            ) : (
              <div className="space-y-2">
                {recentViews.slice(0, 20).map((rv) => (
                  <div key={rv.id} className="rounded-xl border border-border bg-background/80 px-3 py-2">
                    {(() => {
                      const bookId = extractBookId(rv);
                      return (
                        <p className="text-sm font-semibold">
                          {bookId ? (
                            <Link to={`/book/${bookId}`} className="hover:text-primary hover:underline">
                              {rv.title || rv.bookTitle || rv.book_title || `BOOK #${bookId}`}
                            </Link>
                          ) : (
                            rv.title || rv.bookTitle || rv.book_title || "도서 정보 없음"
                          )}
                        </p>
                      );
                    })()}
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {rv.author || "-"} | {formatDate(rv.viewedAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        );

      case "wishlist":
        return (
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-4 text-lg font-bold">{TEXT.wishlist}</h2>
            {wishlist.length === 0 ? (
              <p className="rounded-xl bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">{TEXT.emptyWishlist}</p>
            ) : (
              <div className="space-y-2">
                {wishlist.slice(0, 30).map((w) => (
                  <div key={w.id} className="flex items-center justify-between rounded-xl border border-border bg-background/80 px-3 py-2">
                    <p className="mr-3 text-sm font-medium">
                      {(() => {
                        const bookId = extractBookId(w);
                        return bookId ? (
                          <Link to={`/book/${bookId}`} className="hover:text-primary hover:underline">
                            {w.title || w.bookTitle || w.book_title || `BOOK #${bookId}`}
                          </Link>
                        ) : (
                          w.title || w.bookTitle || w.book_title || "도서 정보 없음"
                        );
                      })()}
                    </p>
                    <button className="text-xs font-semibold text-red-500 hover:text-red-600" onClick={() => removeWishlist(w.id)}>
                      {TEXT.remove}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        );

      case "reviews":
        return (
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-4 text-lg font-bold">{TEXT.myReviews}</h2>
            {reviewActionError && <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{reviewActionError}</p>}
            {reviewActionMessage && <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{reviewActionMessage}</p>}
            {myReviews.length === 0 ? (
              <p className="rounded-xl bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">{TEXT.emptyMyReviews}</p>
            ) : (
              <div className="space-y-3">
                {myReviews.slice(0, 20).map((review) => {
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
                          {TEXT.ratingLabel}
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
                          {TEXT.reviewContentLabel}
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
                          {savingReviewId === review.id ? TEXT.processing : TEXT.reviewEditSave}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteMyReview(review.id)}
                          disabled={deletingReviewId === review.id}
                          className="inline-flex h-9 items-center rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                          {deletingReviewId === review.id ? TEXT.processing : TEXT.reviewDelete}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );

      case "orders":
        return (
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold">{TEXT.orders}</h2>
              <Link to="/orders" className="text-sm font-semibold text-primary hover:underline">
                {TEXT.viewAllOrders}
              </Link>
            </div>
            {orders.length === 0 ? (
              <p className="rounded-xl bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">{TEXT.emptyOrders}</p>
            ) : (
              <div className="space-y-2">
                {orders.slice(0, 12).map((o) => (
                  <div key={o.id} className="rounded-xl border border-border bg-background/80 px-3 py-2">
                    <p className="text-sm font-semibold">{TEXT.orderNumber}: {o.orderNumber}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {TEXT.orderStatus}: {o.status} | {TEXT.orderAmount}: {formatMoney(o.totalAmount)} KRW | {TEXT.orderDate}: {formatDate(o.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        );

      case "wallet":
        return (
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-4 text-lg font-bold">{TEXT.wallet}</h2>
            {walletLoadError && <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{walletLoadError}</p>}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-background/80 p-3">
                <p className="text-xs text-muted-foreground">{TEXT.currentPoints}</p>
                <p className="mt-1 text-xl font-extrabold">{summary.currentPoints.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-border bg-background/80 p-3">
                <p className="text-xs text-muted-foreground">{TEXT.pointHistoryCount}</p>
                <p className="mt-1 text-xl font-extrabold">{summary.pointHistoryCount}</p>
              </div>
              <div className="rounded-xl border border-border bg-background/80 p-3">
                <p className="text-xs text-muted-foreground">{TEXT.couponCount}</p>
                <p className="mt-1 text-xl font-extrabold">{summary.couponCount}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold">{TEXT.availableCoupons}</p>
              {(wallet?.coupons || []).filter((c) => Number(c.remainingCount || 0) > 0).length === 0 ? (
                <p className="rounded-xl bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">{TEXT.noCoupons}</p>
              ) : (
                <div className="space-y-2">
                  {(wallet?.coupons || [])
                    .filter((c) => Number(c.remainingCount || 0) > 0)
                    .map((c) => (
                      <div key={c.code} className="rounded-xl border border-border bg-background/80 px-3 py-2">
                        <p className="text-sm font-semibold">{c.code}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {String(c.discountType).toUpperCase() === "PERCENT"
                            ? `${c.discountValue}%`
                            : `${formatMoney(c.discountValue)} KRW`}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-background/70 p-3">
                <p className="mb-2 text-sm font-semibold">{TEXT.pointHistoryTitle}</p>
                {pointHistories.length === 0 ? (
                  <p className="rounded-lg bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">{TEXT.emptyPointHistory}</p>
                ) : (
                  <div className="space-y-2">
                    {pointHistories.slice(0, 20).map((history, idx) => {
                      const earned = Number(history.amount || 0) >= 0;
                      return (
                        <div key={`${history.createdAt}-${idx}`} className="rounded-lg border border-border px-3 py-2">
                          <p className="text-xs font-semibold">
                            {TEXT.historyType}: {earned ? TEXT.pointEarn : TEXT.pointUse}
                          </p>
                          <p className={`mt-1 text-xs font-semibold ${earned ? "text-emerald-700" : "text-red-600"}`}>
                            {TEXT.historyAmount}: {Number(history.amount || 0) > 0 ? "+" : ""}
                            {Number(history.amount || 0).toLocaleString()}P
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {TEXT.historyDesc}: {formatPointHistoryDescription(history.description, history.amount)}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">{TEXT.historyDate}: {formatDateTime(history.createdAt)}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-border bg-background/70 p-3">
                <p className="mb-2 text-sm font-semibold">{TEXT.couponHistoryTitle}</p>
                {couponHistories.length === 0 ? (
                  <p className="rounded-lg bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">{TEXT.emptyCouponHistory}</p>
                ) : (
                  <div className="space-y-2">
                    {couponHistories.slice(0, 20).map((history) => (
                      <div key={history.key} className="rounded-lg border border-border px-3 py-2">
                        <p className="text-xs font-semibold">
                          {TEXT.historyType}: {history.actionType === "USE" ? TEXT.couponUse : TEXT.couponAcquire}
                        </p>
                        <p className="mt-1 text-xs font-semibold">
                          {history.couponCode || "-"}
                          {history.discountValue != null && history.discountType ? (
                            <>
                              {" "}
                              (
                              {String(history.discountType).toUpperCase() === "PERCENT"
                                ? `${history.discountValue}%`
                                : `${formatMoney(history.discountValue)} KRW`}
                              )
                            </>
                          ) : null}
                        </p>
                        {history.orderNumber && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {TEXT.couponOrderNumber}: {history.orderNumber}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">{TEXT.historyDate}: {formatDateTime(history.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case "favorites":
        return (
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">{TEXT.favoritePosts}</h2>
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
              <p className="rounded-xl bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">{TEXT.emptyFavorite}</p>
            ) : (
              <div className="space-y-2">
                {favoritePosts.slice(0, 30).map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-xl border border-border bg-background/80 px-3 py-2">
                    <div className="mr-3">
                      <p className="text-sm font-medium">{p.postTitle}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(p.createdAt)}</p>
                    </div>
                    <button className="text-xs font-semibold text-red-500 hover:text-red-600" onClick={() => removeFavoritePost(p.id)}>
                      {TEXT.remove}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <PageLayout hideIntro>
      <section className="mx-auto max-w-6xl space-y-5">
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{TEXT.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{isMainView ? "프로필/계정 탈퇴만 메인에서 관리하고, 나머지는 하위페이지에서 설정하세요." : `${sectionTitles[sectionKey] || TEXT.title} 설정 페이지`}</p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                <Mail size={13} />
                {profile?.email || user?.email || "-"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {!isMainView && (
                <Link to="/mypage" className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold hover:bg-secondary">
                  마이페이지 메인
                </Link>
              )}
              <button
                type="button"
                onClick={loadMyProfile}
                className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold hover:bg-secondary"
              >
                {TEXT.viewMyInfo}
              </button>
              <button
                type="button"
                onClick={loadExtras}
                disabled={refreshing}
                className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {refreshing ? TEXT.processing : TEXT.refresh}
              </button>
            </div>
          </div>

          {extrasError && <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">{extrasError}</p>}

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {shortcuts.map((shortcut) => (
              <ShortcutCard
                key={shortcut.key}
                icon={shortcut.icon}
                label={shortcut.label}
                to={shortcut.to}
                value={shortcut.value}
                description={shortcut.description}
              />
            ))}
          </div>
        </div>

        {!isKnownSection ? (
          <section className="rounded-2xl border border-red-200 bg-card p-6">
            <p className="text-sm text-red-600">잘못된 마이페이지 경로입니다.</p>
            <Link to="/mypage" className="mt-3 inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold hover:bg-secondary">
              마이페이지 메인으로 이동
            </Link>
          </section>
        ) : isMainView ? (
          <div className="grid gap-5 xl:grid-cols-2">
            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center gap-2">
                <UserRound size={18} className="text-primary" />
                <h2 className="text-lg font-bold">{TEXT.profile}</h2>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">{TEXT.profileHint}</p>

              <div className="space-y-3">
                <label className="block">
                  <span className="mb-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail size={12} />
                    {TEXT.email}
                  </span>
                  <input className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" value={profile?.email || user?.email || ""} disabled />
                </label>
                <label className="block">
                  <span className="mb-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <PencilLine size={12} />
                    {TEXT.name}
                  </span>
                  <input className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
                </label>
                <label className="block">
                  <span className="mb-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone size={12} />
                    {TEXT.phone}
                  </span>
                  <input className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" value={edit.phone} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} />
                </label>
                <label className="block">
                  <span className="mb-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={12} />
                    {TEXT.address}
                  </span>
                  <input className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" value={edit.address} onChange={(e) => setEdit({ ...edit, address: e.target.value })} />
                </label>
              </div>

              {profileErr && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{profileErr}</p>}
              {profileMsg && <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{profileMsg}</p>}

              <button
                type="button"
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
                onClick={save}
                disabled={savingProfile}
              >
                <Save size={14} />
                {savingProfile ? TEXT.processing : TEXT.save}
              </button>
            </section>

            <section className="rounded-2xl border border-red-200 bg-card p-5">
              <div className="mb-4 flex items-center gap-2 text-red-600">
                <AlertTriangle size={18} />
                <h2 className="text-lg font-bold">{TEXT.danger}</h2>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">{TEXT.dangerHint}</p>
              <input
                type="password"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                placeholder={TEXT.deleteConfirmPw}
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
              {deleteError && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{deleteError}</p>}
              <button
                type="button"
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                onClick={removeAccount}
                disabled={deleting}
              >
                <Trash2 size={14} />
                {deleting ? TEXT.processing : TEXT.deleteButton}
              </button>
            </section>
          </div>
        ) : (
          <div className="space-y-4">{renderSubpageSection()}</div>
        )}
      </section>
    </PageLayout>
  );
}
