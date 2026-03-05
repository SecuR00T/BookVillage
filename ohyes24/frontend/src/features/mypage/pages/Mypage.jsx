import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  loading: "\uB9C8\uC774\uD398\uC774\uC9C0 \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4.",
  title: "\uB9C8\uC774\uD398\uC774\uC9C0",
  subtitle: "\uD68C\uC6D0 \uC815\uBCF4, \uBCF4\uAD00\uD568, \uD65C\uB3D9 \uAE30\uB85D\uC744 \uD55C \uACF3\uC5D0\uC11C \uAD00\uB9AC\uD558\uC138\uC694.",
  profile: "\uD504\uB85C\uD544 \uC815\uBCF4",
  profileHint: "\uAE30\uBCF8 \uC815\uBCF4\uB97C \uC218\uC815\uD558\uACE0 \uC800\uC7A5\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
  email: "\uC774\uBA54\uC77C",
  name: "\uC774\uB984",
  phone: "\uC5F0\uB77D\uCC98",
  address: "\uC8FC\uC18C",
  save: "\uD504\uB85C\uD544 \uC800\uC7A5",
  saveDone: "\uD504\uB85C\uD544\uC774 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
  saveFail: "\uD504\uB85C\uD544 \uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.",
  security: "\uBCF4\uC548 \uC124\uC815",
  securityHint: "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD\uC744 \uD1B5\uD574 \uACC4\uC815 \uBCF4\uC548\uC744 \uC720\uC9C0\uD558\uC138\uC694.",
  currentPassword: "\uD604\uC7AC \uBE44\uBC00\uBC88\uD638",
  newPassword: "\uC0C8 \uBE44\uBC00\uBC88\uD638",
  confirmPassword: "\uC0C8 \uBE44\uBC00\uBC88\uD638 \uD655\uC778",
  pwUpdate: "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD",
  pwDone: "\uBE44\uBC00\uBC88\uD638\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
  pwFillAll: "\uBE44\uBC00\uBC88\uD638 \uD56D\uBAA9\uC744 \uBAA8\uB450 \uC785\uB825\uD574 \uC8FC\uC138\uC694.",
  pwMin: "\uC0C8 \uBE44\uBC00\uBC88\uD638\uB294 8\uC790 \uC774\uC0C1\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4.",
  pwNotMatch: "\uC0C8 \uBE44\uBC00\uBC88\uD638 \uD655\uC778\uC774 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
  pwFail: "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.",
  processing: "\uCC98\uB9AC \uC911...",
  danger: "\uACC4\uC815 \uD0C8\uD1F4",
  dangerHint: "\uD0C8\uD1F4 \uC2DC \uACC4\uC815 \uBC0F \uD65C\uB3D9 \uAE30\uB85D\uC774 \uC0AD\uC81C\uB429\uB2C8\uB2E4.",
  deleteConfirmPw: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778",
  deleteButton: "\uACC4\uC815 \uD0C8\uD1F4",
  deleteNeedPw: "\uBE44\uBC00\uBC88\uD638\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.",
  deleteAsk: "\uACC4\uC815\uC744 \uC815\uB9D0\uB85C \uC0AD\uC81C\uD560\uAE4C\uC694? \uBCF5\uAD6C\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.",
  deleteFail: "\uACC4\uC815 \uC0AD\uC81C\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.",
  orders: "\uB0B4 \uC8FC\uBB38",
  emptyOrders: "\uC8FC\uBB38 \uB0B4\uC5ED\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  viewAllOrders: "\uC8FC\uBB38 \uC0C1\uC138 \uBCF4\uAE30",
  orderNumber: "\uC8FC\uBB38\uBC88\uD638",
  orderStatus: "\uC0C1\uD0DC",
  orderAmount: "\uAE08\uC561",
  orderDate: "\uC8FC\uBB38\uC77C",
  recentViews: "\uCD5C\uADFC \uC870\uD68C",
  wishlist: "\uCC1C \uBAA9\uB85D",
  wallet: "\uC9C0\uAC11",
  favoritePosts: "\uAD00\uC2EC \uAC8C\uC2DC\uAE00",
  myReviews: "\uB098\uC758 \uB9AC\uBDF0 \uAD00\uB9AC",
  emptyRecent: "\uCD5C\uADFC \uC870\uD68C\uD55C \uB3C4\uC11C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
  emptyWishlist: "\uCC1C\uD55C \uB3C4\uC11C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
  emptyFavorite: "\uAD00\uC2EC \uAC8C\uC2DC\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  emptyMyReviews: "\uC791\uC131\uD55C \uB9AC\uBDF0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
  remove: "\uC0AD\uC81C",
  ratingLabel: "\uD3C9\uC810",
  reviewContentLabel: "\uB9AC\uBDF0 \uB0B4\uC6A9",
  reviewEditSave: "\uB9AC\uBDF0 \uC218\uC815",
  reviewDelete: "\uB9AC\uBDF0 \uC0AD\uC81C",
  reviewSaved: "\uB9AC\uBDF0\uAC00 \uC218\uC815\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
  reviewDeleted: "\uB9AC\uBDF0\uAC00 \uC0AD\uC81C\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
  reviewContentRequired: "\uB9AC\uBDF0 \uB0B4\uC6A9\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.",
  reviewDeleteAsk: "\uC120\uD0DD\uD55C \uB9AC\uBDF0\uB97C \uC0AD\uC81C\uD560\uAE4C\uC694?",
  reviewRatingRange: "\uD3C9\uC810\uC740 1~5 \uC0AC\uC774\uC5EC\uC57C \uD569\uB2C8\uB2E4.",
  reviewUpdateFail: "\uB9AC\uBDF0 \uC218\uC815\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.",
  reviewDeleteFail: "\uB9AC\uBDF0 \uC0AD\uC81C\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.",
  currentPoints: "\uD604\uC7AC \uD3EC\uC778\uD2B8",
  pointHistoryCount: "\uD3EC\uC778\uD2B8 \uAE30\uB85D",
  couponCount: "\uBCF4\uC720 \uCFE0\uD3F0",
  availableCoupons: "\uC0AC\uC6A9 \uAC00\uB2A5 \uCFE0\uD3F0",
  noCoupons: "\uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uCFE0\uD3F0\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  pointHistoryTitle: "\uD3EC\uC778\uD2B8 \uD68D\uB4DD/\uC0AC\uC6A9 \uB0B4\uC5ED",
  couponHistoryTitle: "\uCFE0\uD3F0 \uD69F\uB4DD/\uC0AC\uC6A9 \uB0B4\uC5ED",
  emptyPointHistory: "\uD3EC\uC778\uD2B8 \uB0B4\uC5ED\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  emptyCouponHistory: "\uCFE0\uD3F0 \uB0B4\uC5ED\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  historyType: "\uAD6C\uBD84",
  historyAmount: "\uAE08\uC561/\uD61C\uD0DD",
  historyDesc: "\uB0B4\uC6A9",
  historyDate: "\uC77C\uC2DC",
  pointEarn: "\uD3EC\uC778\uD2B8 \uD68D\uB4DD",
  pointUse: "\uD3EC\uC778\uD2B8 \uC0AC\uC6A9",
  pointDescPurchaseEarn: "\uB3C4\uC11C \uAD6C\uB9E4 \uC801\uB9BD",
  pointDescPurchaseUse: "\uB3C4\uC11C \uAD6C\uB9E4 \uC2DC \uD3EC\uC778\uD2B8 \uC0AC\uC6A9",
  couponAcquire: "\uCFE0\uD3F0 \uD68D\uB4DD",
  couponUse: "\uCFE0\uD3F0 \uC0AC\uC6A9",
  couponOrderNumber: "\uC8FC\uBB38\uBC88\uD638",
  recentCount: "\uCD5C\uADFC \uC870\uD68C",
  wishlistCount: "\uCC1C \uC218",
  orderCount: "\uC8FC\uBB38 \uC218",
  refresh: "\uC0C8\uB85C\uACE0\uCE68",
  viewMyInfo: "\uB0B4 \uC815\uBCF4 \uBCF4\uAE30",
  profileLoadFail: "\uD68C\uC6D0 \uC815\uBCF4 \uC870\uD68C\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.",
  ordersShortcut: "\uB0B4 \uC8FC\uBB38 \uBCF4\uAE30",
  couponsShortcut: "\uCFE0\uD3F0 \uD655\uC778",
  walletLoadFail: "\uCFE0\uD3F0/\uD3EC\uC778\uD2B8 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC0C8\uB85C\uACE0\uCE68\uC744 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.",
  partialLoad: "\uC77C\uBD80 \uC704\uC82F \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uC0C8\uB85C\uACE0\uCE68\uC73C\uB85C \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.",
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

const SummaryCard = ({ icon: Icon, label, value, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full rounded-2xl border border-border bg-background/70 p-4 text-left transition-colors hover:bg-background"
  >
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon size={15} />
      <p className="text-xs font-medium">{label}</p>
    </div>
    <p className="mt-2 text-2xl font-extrabold">{value}</p>
  </button>
);

export default function Mypage() {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();

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

  const recentRef = useRef(null);
  const orderRef = useRef(null);
  const wishlistRef = useRef(null);
  const walletRef = useRef(null);
  const reviewRef = useRef(null);
  const favoriteRef = useRef(null);

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

  const scrollToSection = (ref) => {
    if (!ref?.current) return;
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
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

  if (profileLoading) {
    return (
      <PageLayout hideIntro>
        <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          <Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin" />
          {TEXT.loading}
        </div>
      </PageLayout>
    );
  }

  if (!profile) {
    return (
      <PageLayout hideIntro>
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-card p-8">
          <p className="text-sm font-semibold text-red-600">{profileErr || TEXT.profileLoadFail}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadMyProfile}
              className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold hover:bg-secondary"
            >
              {TEXT.viewMyInfo}
            </button>
            <button
              type="button"
              onClick={loadMyProfile}
              className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              {TEXT.refresh}
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout hideIntro>
      <section className="mx-auto max-w-6xl space-y-5">
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{TEXT.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{TEXT.subtitle}</p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                <Mail size={13} />
                {profile.email}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={loadMyProfile}
                className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold hover:bg-secondary"
              >
                {TEXT.viewMyInfo}
              </button>
              <Link to="/orders" className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold hover:bg-secondary">
                {TEXT.ordersShortcut}
              </Link>
              <button
                type="button"
                onClick={() => scrollToSection(walletRef)}
                className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold hover:bg-secondary"
              >
                {TEXT.couponsShortcut}
              </button>
            </div>
          </div>

          {extrasError && <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">{extrasError}</p>}

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <SummaryCard icon={Clock3} label={TEXT.recentCount} value={summary.recentCount} onClick={() => scrollToSection(recentRef)} />
            <SummaryCard icon={Ticket} label={TEXT.orderCount} value={summary.orderCount} onClick={() => scrollToSection(orderRef)} />
            <SummaryCard icon={Heart} label={TEXT.wishlistCount} value={summary.wishlistCount} onClick={() => scrollToSection(wishlistRef)} />
            <SummaryCard icon={Wallet} label={TEXT.currentPoints} value={summary.currentPoints.toLocaleString()} onClick={() => scrollToSection(walletRef)} />
            <SummaryCard icon={Ticket} label={TEXT.couponCount} value={summary.couponCount} onClick={() => scrollToSection(walletRef)} />
          </div>
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-2">
          <div className="space-y-5 xl:contents">
            <section className="rounded-2xl border border-border bg-card p-5 xl:order-1">
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
                  <input className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" value={profile.email || ""} disabled />
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

            <section className="rounded-2xl border border-border bg-card p-5 xl:order-3">
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

            <section className="rounded-2xl border border-red-200 bg-card p-5 xl:order-5">
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

          <div className="space-y-5 xl:contents">
            <section ref={recentRef} className="rounded-2xl border border-border bg-card p-5 xl:order-2">
              <h2 className="mb-4 text-lg font-bold">{TEXT.recentViews}</h2>
              {recentViews.length === 0 ? (
                <p className="rounded-xl bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">{TEXT.emptyRecent}</p>
              ) : (
                <div className="space-y-2">
                  {recentViews.slice(0, 12).map((rv) => (
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

            <section ref={wishlistRef} className="rounded-2xl border border-border bg-card p-5 xl:order-4">
              <h2 className="mb-4 text-lg font-bold">{TEXT.wishlist}</h2>
              {wishlist.length === 0 ? (
                <p className="rounded-xl bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">{TEXT.emptyWishlist}</p>
              ) : (
                <div className="space-y-2">
                  {wishlist.slice(0, 20).map((w) => (
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

            <section ref={reviewRef} className="rounded-2xl border border-border bg-card p-5 xl:order-6">
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

            <section ref={orderRef} className="rounded-2xl border border-border bg-card p-5 xl:order-7 xl:col-span-2">
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
                  {orders.slice(0, 6).map((o) => (
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

            <section ref={walletRef} className="rounded-2xl border border-border bg-card p-5 xl:order-8 xl:col-span-2">
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

            <section ref={favoriteRef} className="rounded-2xl border border-border bg-card p-5 xl:order-9 xl:col-span-2">
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
                  {favoritePosts.slice(0, 20).map((p) => (
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
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
