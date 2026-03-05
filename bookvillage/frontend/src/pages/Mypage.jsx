import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Clock3, Heart, Loader2, Mail, Ticket, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/api/client";
import PageLayout from "@/components/PageLayout";

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
  return d.toLocaleDateString("ko-KR");
};

const formatMoney = (value) => Number(value || 0).toLocaleString("ko-KR");

const extractBookId = (row) => {
  const raw = row?.bookId ?? row?.book_id ?? row?.bookid;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const SummaryCard = ({ icon: Icon, label, value, to }) => (
  <Link
    to={to}
    className="block rounded-2xl border border-border bg-background/70 p-4 text-left transition-colors hover:bg-background"
  >
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon size={15} />
      <p className="text-xs font-medium">{label}</p>
    </div>
    <p className="mt-2 text-2xl font-extrabold">{value}</p>
  </Link>
);

export default function Mypage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  const [summaryFromServer, setSummaryFromServer] = useState(null);
  const [recentViews, setRecentViews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [extrasError, setExtrasError] = useState("");

  const loadProfile = async () => {
    if (!user?.id) return;
    setProfileLoading(true);
    setProfileError("");
    try {
      const data = await api.users.getProfileByUserId(Number(user.id));
      setProfile(data || null);
    } catch (err) {
      setProfile(null);
      setProfileError(err instanceof Error ? err.message : "회원 정보를 불러오지 못했습니다.");
    } finally {
      setProfileLoading(false);
    }
  };

  const loadExtras = async () => {
    setRefreshing(true);
    setExtrasError("");
    const [sm, rv, od, ws, wl] = await Promise.allSettled([
      api.mypage.summary(),
      api.mypage.recentViews(),
      api.orders.list(),
      api.mypage.wishlist(),
      api.mypage.wallet(),
    ]);

    setSummaryFromServer(sm.status === "fulfilled" ? sm.value || null : null);
    setRecentViews(rv.status === "fulfilled" ? rv.value || [] : []);
    setOrders(od.status === "fulfilled" ? od.value || [] : []);
    setWishlist(ws.status === "fulfilled" ? ws.value || [] : []);
    setWallet(wl.status === "fulfilled" ? wl.value || null : null);

    if ([sm, rv, od, ws, wl].some((result) => result.status === "rejected")) {
      setExtrasError("일부 마이페이지 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
    setRefreshing(false);
  };

  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    (async () => {
      await loadProfile();
      if (active) {
        await loadExtras();
      }
    })();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const summary = useMemo(
    () => ({
      recentCount: Number(summaryFromServer?.recentCount ?? recentViews.length),
      orderCount: Number(orders.length),
      wishlistCount: Number(summaryFromServer?.wishlistCount ?? wishlist.length),
      currentPoints: Number(summaryFromServer?.currentPoints ?? wallet?.currentPoints ?? 0),
      couponCount: Number(summaryFromServer?.couponCount ?? (wallet?.coupons || []).length),
    }),
    [summaryFromServer, recentViews, orders, wishlist, wallet],
  );

  if (profileLoading) {
    return (
      <PageLayout hideIntro>
        <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          <Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin" />
          마이페이지 정보를 불러오는 중입니다.
        </div>
      </PageLayout>
    );
  }

  if (!profile) {
    return (
      <PageLayout hideIntro>
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-card p-8">
          <p className="text-sm font-semibold text-red-600">{profileError || "회원 정보를 불러오지 못했습니다."}</p>
          <button
            type="button"
            onClick={loadProfile}
            className="mt-4 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            다시 시도
          </button>
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
              <h1 className="text-3xl font-extrabold tracking-tight">마이페이지</h1>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                <Mail size={13} />
                {profile.email}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={loadExtras}
                disabled={refreshing}
                className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold hover:bg-secondary disabled:opacity-60"
              >
                {refreshing ? "새로고침 중..." : "새로고침"}
              </button>
              <Link to="/books" className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90">
                도서 보러가기
              </Link>
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/mypage/account" className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-secondary">
              내 계정 관리
            </Link>
            <Link to="/mypage/activity" className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-secondary">
              내 활동 관리
            </Link>
            <Link to="/mypage/wallet" className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-secondary">
              포인트/쿠폰 관리
            </Link>
            <Link to="/orders" className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-secondary">
              내 주문 보기
            </Link>
          </div>

          {extrasError && <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">{extrasError}</p>}

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <SummaryCard icon={Clock3} label="최근 조회" value={summary.recentCount} to="/mypage/activity" />
            <SummaryCard icon={Ticket} label="주문 수" value={summary.orderCount} to="/orders" />
            <SummaryCard icon={Heart} label="찜 수" value={summary.wishlistCount} to="/mypage/activity" />
            <SummaryCard icon={Wallet} label="현재 포인트" value={summary.currentPoints.toLocaleString()} to="/mypage/wallet" />
            <SummaryCard icon={Ticket} label="보유 쿠폰" value={summary.couponCount} to="/mypage/wallet" />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold">최근 조회 미리보기</h2>
              <Link to="/mypage/activity" className="text-xs font-semibold text-primary hover:underline">
                전체 보기
              </Link>
            </div>
            {recentViews.length === 0 ? (
              <p className="rounded-xl bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">최근 조회한 도서가 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {recentViews.slice(0, 3).map((rv) => {
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
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold">주문 미리보기</h2>
              <Link to="/orders" className="text-xs font-semibold text-primary hover:underline">
                주문 전체 보기
              </Link>
            </div>
            {orders.length === 0 ? (
              <p className="rounded-xl bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">주문 내역이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {orders.slice(0, 3).map((o) => (
                  <div key={o.id} className="rounded-xl border border-border bg-background/80 px-3 py-2">
                    <p className="text-sm font-semibold">{o.orderNumber}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {o.status} | {formatMoney(o.totalAmount)} KRW | {formatDate(o.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold">내 정보 요약</h2>
              <Link to="/mypage/account" className="text-xs font-semibold text-primary hover:underline">
                계정 상세 관리
              </Link>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-background/80 px-3 py-2">
                <p className="text-xs text-muted-foreground">이름</p>
                <p className="text-sm font-semibold">{profile.name || "-"}</p>
              </div>
              <div className="rounded-xl border border-border bg-background/80 px-3 py-2">
                <p className="text-xs text-muted-foreground">연락처</p>
                <p className="text-sm font-semibold">{profile.phone || "-"}</p>
              </div>
              <div className="rounded-xl border border-border bg-background/80 px-3 py-2 sm:col-span-2">
                <p className="text-xs text-muted-foreground">주소</p>
                <p className="text-sm font-semibold">{profile.address || "-"}</p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </PageLayout>
  );
}
