import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, Loader2, MapPin, Minus, Plus, ShoppingBag, TicketPercent, Trash2, Wallet } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/api/client";
import PageLayout from "@/components/PageLayout";

const PAYMENT_OPTIONS = [
  { value: "CARD", label: "\uC2E0\uC6A9\uCE74\uB4DC" },
  { value: "BANK_TRANSFER", label: "\uBB34\uD1B5\uC7A5 \uC785\uAE08" },
  { value: "PAY", label: "\uAC04\uD3B8\uACB0\uC81C" },
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
      setError("\uC7A5\uBC14\uAD6C\uB2C8 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
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
      setError(e instanceof Error ? e.message : "\uC218\uB7C9 \uBCC0\uACBD\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
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
      setError(e instanceof Error ? e.message : "\uC0AD\uC81C\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
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
      setNotice("\uC7A5\uBC14\uAD6C\uB2C8\uB97C \uBE44\uC6E0\uC2B5\uB2C8\uB2E4.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "\uC7A5\uBC14\uAD6C\uB2C8 \uBE44\uC6B0\uAE30\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
    } finally {
      setClearing(false);
    }
  };

  const checkout = async () => {
    if (!items.length) return;
    if (!shippingAddress.trim()) {
      setError("\uBC30\uC1A1\uC9C0\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
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
      setError(e instanceof Error ? e.message : "\uACB0\uC81C\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="장바구니" description="결제 전 주문 내역을 확인하세요.">
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          <Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin" />
          {"\uC7A5\uBC14\uAD6C\uB2C8\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4."}
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
          <p className="text-lg font-semibold">{"\uC7A5\uBC14\uAD6C\uB2C8\uAC00 \uBE44\uC5B4 \uC788\uC2B5\uB2C8\uB2E4."}</p>
          <p className="mt-1 text-sm text-muted-foreground">{"\uB3C4\uC11C \uD398\uC774\uC9C0\uC5D0\uC11C \uCC45\uC744 \uB2F4\uC544 \uBCF4\uC138\uC694."}</p>
          <Link to="/books" className="mt-4 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90">
            {"\uB3C4\uC11C \uBCF4\uB7EC\uAC00\uAE30"}
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <section className="space-y-3">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-bold">
                  {"\uB2F4\uAE34 \uC0C1\uD488 "}
                  {items.length}
                  {"\uAC1C"}
                </h2>
                <div className="flex items-center gap-2">
                  <Link to="/books" className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-sm hover:bg-secondary">
                    {"\uACC4\uC18D \uC1FC\uD551"}
                  </Link>
                  <button
                    type="button"
                    className="inline-flex h-9 items-center rounded-lg border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                    onClick={clearCart}
                    disabled={clearing}
                  >
                    {clearing ? "\uCC98\uB9AC \uC911..." : "\uC7A5\uBC14\uAD6C\uB2C8 \uBE44\uC6B0\uAE30"}
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
                        {"\uC0AD\uC81C"}
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
              <h2 className="mb-3 text-lg font-bold">{"\uACB0\uC81C \uC815\uBCF4"}</h2>
              <div className="space-y-3">
                <label className="block">
                  <span className="mb-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <CreditCard size={13} />
                    {"\uACB0\uC81C \uC218\uB2E8"}
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
                    {"\uCFE0\uD3F0 \uC120\uD0DD"}
                  </span>
                  <select
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    value={selectedCouponCode}
                    onChange={(e) => setSelectedCouponCode(e.target.value)}
                  >
                    <option value="">{"\uC801\uC6A9 \uC548 \uD568"}</option>
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
                    {"\uD3EC\uC778\uD2B8 \uC0AC\uC6A9 (\uBCF4\uC720: "}
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
                    {"\uCD5C\uB300 "}
                    {Math.min(availablePoints, maxPointsByAmount).toLocaleString()}p
                    {" \uC0AC\uC6A9 \uAC00\uB2A5"}
                  </p>
                </label>

                <label className="block">
                  <span className="mb-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={13} />
                    {"\uBC30\uC1A1\uC9C0"}
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
              <h2 className="mb-3 text-lg font-bold">{"\uACB0\uC81C \uAE08\uC561"}</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{"\uC0C1\uD488 \uAE08\uC561"}</span>
                  <span className="font-semibold">{formatKrw(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{"\uCFE0\uD3F0 \uD560\uC778"}</span>
                  <span className="font-semibold text-emerald-700">- {formatKrw(discount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{"\uD3EC\uC778\uD2B8 \uC0AC\uC6A9"}</span>
                  <span className="font-semibold text-emerald-700">- {formatKrw(appliedPoints)}</span>
                </div>
                <hr className="border-border" />
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold">{"\uCD5C\uC885 \uACB0\uC81C\uAE08\uC561"}</span>
                  <span className="text-xl font-extrabold text-price">{formatKrw(finalTotal)}</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60"
                onClick={checkout}
                disabled={submitting}
              >
                {submitting ? "\uACB0\uC81C \uCC98\uB9AC \uC911..." : "\uACB0\uC81C\uD558\uAE30"}
              </button>
            </section>
          </aside>
        </div>
      )}
    </PageLayout>
  );
}
