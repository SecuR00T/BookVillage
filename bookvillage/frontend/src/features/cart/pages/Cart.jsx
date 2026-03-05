import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, Loader2, MapPin, Minus, Plus, ShoppingBag, TicketPercent, Trash2, Wallet } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/api/client";
import PageLayout from "@/components/PageLayout";

const PAYMENT_OPTIONS = [
  { value: "CARD", label: "신용카드" },
  { value: "BANK_TRANSFER", label: "무통장 입금" },
  { value: "PAY", label: "간편결제" },
];

const toSafeNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const formatKrw = (value) => `${Math.round(toSafeNumber(value, 0)).toLocaleString()} KRW`;

const couponDiscount = (coupon, subtotal) => {
  if (!coupon || subtotal <= 0) return 0;
  const remainingCount = toSafeNumber(coupon.remainingCount, 0);
  if (remainingCount <= 0) return 0;

  const discountValue = toSafeNumber(coupon.discountValue, 0);
  if (String(coupon.discountType).toUpperCase() === "PERCENT") {
    return Math.min(subtotal, Math.floor((subtotal * discountValue) / 100));
  }
  return Math.min(subtotal, discountValue);
};

const formatCoupon = (coupon) => {
  if (!coupon) return "";
  const value = toSafeNumber(coupon.discountValue, 0);
  const body = String(coupon.discountType).toUpperCase() === "PERCENT" ? `${value}%` : `${value.toLocaleString()} KRW`;
  return `${coupon.code} (${body})`;
};

export default function Cart() {
  const { items, syncFromServer, replaceItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [busyBookId, setBusyBookId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [wallet, setWallet] = useState({ currentPoints: 0, coupons: [] });
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [selectedCouponCode, setSelectedCouponCode] = useState("");
  const [usePoints, setUsePoints] = useState(0);
  const [shippingAddress, setShippingAddress] = useState("");

  const coupons = useMemo(() => (wallet?.coupons || []).filter((c) => toSafeNumber(c.remainingCount, 0) > 0), [wallet]);
  const selectedCoupon = useMemo(() => coupons.find((c) => c.code === selectedCouponCode) || null, [coupons, selectedCouponCode]);

  const subtotal = useMemo(
    () => items.reduce((acc, cur) => acc + toSafeNumber(cur.price, 0) * toSafeNumber(cur.quantity, 1), 0),
    [items],
  );
  const discount = useMemo(() => couponDiscount(selectedCoupon, subtotal), [selectedCoupon, subtotal]);
  const availablePoints = useMemo(() => toSafeNumber(wallet?.currentPoints, 0), [wallet]);
  const maxPointsByAmount = Math.max(0, Math.floor(subtotal - discount));
  const appliedPoints = Math.min(Math.max(0, toSafeNumber(usePoints, 0)), availablePoints, maxPointsByAmount);
  const finalTotal = Math.max(0, subtotal - discount - appliedPoints);

  const loadData = async () => {
    setLoading(true);
    setError("");

    const [cartRes, walletRes, profileRes] = await Promise.allSettled([
      api.cart.list(),
      api.mypage.wallet(),
      user ? api.users.get(user.id) : Promise.resolve(null),
    ]);

    if (cartRes.status === "fulfilled") {
      replaceItems(cartRes.value || []);
    } else {
      setError("장바구니 목록을 불러오지 못했습니다.");
      replaceItems([]);
    }

    if (walletRes.status === "fulfilled") {
      setWallet(walletRes.value || { currentPoints: 0, coupons: [] });
    } else {
      setWallet({ currentPoints: 0, coupons: [] });
    }

    if (profileRes.status === "fulfilled" && profileRes.value) {
      setShippingAddress((prev) => {
        if (prev && prev.trim()) return prev;
        return profileRes.value.address || "Seoul";
      });
    } else {
      setShippingAddress((prev) => (prev && prev.trim() ? prev : "Seoul"));
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const changeQty = async (item, delta) => {
    if (!item?.cartItemId) return;
    const next = Math.max(1, toSafeNumber(item.quantity, 1) + delta);
    setBusyBookId(item.bookId);
    setError("");
    try {
      await api.cart.update(item.cartItemId, next);
      await syncFromServer();
    } catch (e) {
      setError(e instanceof Error ? e.message : "수량 변경에 실패했습니다.");
    } finally {
      setBusyBookId(null);
    }
  };

  const remove = async (item) => {
    if (!item?.cartItemId) return;
    setBusyBookId(item.bookId);
    setError("");
    try {
      await api.cart.remove(item.cartItemId);
      await syncFromServer();
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제에 실패했습니다.");
    } finally {
      setBusyBookId(null);
    }
  };

  const clearCart = async () => {
    setClearing(true);
    setError("");
    try {
      await api.cart.clear();
      await syncFromServer();
      setNotice("장바구니를 비웠습니다.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "장바구니 비우기에 실패했습니다.");
    } finally {
      setClearing(false);
    }
  };

  const checkout = async () => {
    if (!items.length) return;
    if (!shippingAddress.trim()) {
      setError("배송지를 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      const order = await api.orders.checkout({
        items: items.map((v) => ({ bookId: v.bookId, quantity: v.quantity })),
        paymentMethod,
        couponCode: selectedCouponCode || undefined,
        usePoints: appliedPoints > 0 ? appliedPoints : undefined,
        shippingAddress: shippingAddress.trim(),
      });

      await syncFromServer();
      navigate("/orders", { state: { latestOrder: order } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "결제에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="장바구니" description="결제 전 주문 내역을 확인하세요.">
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          <Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin" />
          {"장바구니를 불러오는 중입니다."}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="장바구니" description="쿠폰과 포인트를 적용해 최종 결제 금액을 확인하세요.">
      {error && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {notice && <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{notice}</p>}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-lg font-semibold">{"장바구니가 비어 있습니다."}</p>
          <p className="mt-1 text-sm text-muted-foreground">{"도서 페이지에서 책을 담아 보세요."}</p>
          <Link to="/books" className="mt-4 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90">
            {"도서 보러가기"}
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <section className="space-y-3">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-bold">
                  {"담긴 상품 "}
                  {items.length}
                  {"개"}
                </h2>
                <div className="flex items-center gap-2">
                  <Link to="/books" className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-sm hover:bg-secondary">
                    {"계속 쇼핑"}
                  </Link>
                  <button
                    type="button"
                    className="inline-flex h-9 items-center rounded-lg border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                    onClick={clearCart}
                    disabled={clearing}
                  >
                    {clearing ? "처리 중..." : "장바구니 비우기"}
                  </button>
                </div>
              </div>
            </div>

            {items.map((item) => {
              const lineTotal = toSafeNumber(item.price, 0) * toSafeNumber(item.quantity, 1);
              const busy = busyBookId === item.bookId;

              return (
                <article key={item.cartItemId || item.bookId} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{formatKrw(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => changeQty(item, -1)}
                        disabled={busy}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-secondary disabled:opacity-60"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => changeQty(item, 1)}
                        disabled={busy}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-secondary disabled:opacity-60"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(item)}
                        disabled={busy}
                        className="ml-1 inline-flex h-8 items-center gap-1 rounded-md border border-red-200 px-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        <Trash2 size={14} />
                        {"삭제"}
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-right text-sm font-bold text-price">{formatKrw(lineTotal)}</p>
                </article>
              );
            })}
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-3 text-lg font-bold">{"결제 정보"}</h2>
              <div className="space-y-3">
                <label className="block">
                  <span className="mb-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <CreditCard size={13} />
                    {"결제 수단"}
                  </span>
                  <select
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    {PAYMENT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <TicketPercent size={13} />
                    {"쿠폰 선택"}
                  </span>
                  <select
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    value={selectedCouponCode}
                    onChange={(e) => setSelectedCouponCode(e.target.value)}
                  >
                    <option value="">{"적용 안 함"}</option>
                    {coupons.map((coupon) => (
                      <option key={coupon.code} value={coupon.code}>
                        {formatCoupon(coupon)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Wallet size={13} />
                    {"포인트 사용 (보유: "}
                    {availablePoints.toLocaleString()}p{")"}
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={Math.min(availablePoints, maxPointsByAmount)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    value={usePoints}
                    onChange={(e) => setUsePoints(toSafeNumber(e.target.value, 0))}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {"최대 "}
                    {Math.min(availablePoints, maxPointsByAmount).toLocaleString()}p
                    {" 사용 가능"}
                  </p>
                </label>

                <label className="block">
                  <span className="mb-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={13} />
                    {"배송지"}
                  </span>
                  <input
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="배송지 주소"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-3 text-lg font-bold">{"결제 금액"}</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{"상품 금액"}</span>
                  <span className="font-semibold">{formatKrw(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{"쿠폰 할인"}</span>
                  <span className="font-semibold text-emerald-700">- {formatKrw(discount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{"포인트 사용"}</span>
                  <span className="font-semibold text-emerald-700">- {formatKrw(appliedPoints)}</span>
                </div>
                <hr className="border-border" />
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold">{"최종 결제금액"}</span>
                  <span className="text-xl font-extrabold text-price">{formatKrw(finalTotal)}</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60"
                onClick={checkout}
                disabled={submitting}
              >
                {submitting ? "결제 처리 중..." : "결제하기"}
              </button>
            </section>
          </aside>
        </div>
      )}
    </PageLayout>
  );
}
