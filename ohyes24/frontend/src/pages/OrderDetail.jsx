import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "@/api/client";
import PageLayout from "@/components/PageLayout";

const TEXT = {
  title: "주문 상세",
  description: "주문 정보와 주문 상품을 상세하게 확인할 수 있습니다.",
  goOrders: "주문 목록으로 돌아가기",
  loadFail: "주문 상세를 불러오지 못했습니다.",
  notFound: "주문 정보를 찾을 수 없습니다.",
  orderNumber: "주문번호",
  status: "주문상태",
  amount: "결제금액",
  date: "주문일시",
  payment: "결제수단",
  address: "배송지",
  receipt: "영수증 다운로드",
  itemHeader: "주문 상품",
  emptyItems: "주문 상품 정보가 없습니다.",
  bookId: "도서 ID",
  qty: "수량",
  unitPrice: "단가",
  lineTotal: "합계",
  trackingPlaceholder: "배송 추적 URL 입력 (실습 시뮬레이션)",
  trackingButton: "배송 추적",
  trackingResult: "추적 결과",
};

const formatMoney = (value) => `${Number(value || 0).toLocaleString("ko-KR")} KRW`;
const formatDateTime = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export default function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [trackingUrl, setTrackingUrl] = useState("");
  const [trackingResult, setTrackingResult] = useState("");

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    setError("");

    api.orders
      .get(orderId)
      .then((v) => setOrder(v || null))
      .catch((err) => setError(err instanceof Error ? err.message : TEXT.loadFail))
      .finally(() => setLoading(false));
  }, [orderId]);

  const items = useMemo(() => (order?.items || []).map((v) => ({ ...v, lineTotal: Number(v.quantity || 0) * Number(v.unitPrice || 0) })), [order]);

  const track = async () => {
    if (!order?.id || !trackingUrl.trim()) return;
    try {
      const result = await api.orders.track(order.id, trackingUrl.trim());
      setTrackingResult(`${result.status} (${result.currentLocation})`);
    } catch (err) {
      setTrackingResult(err instanceof Error ? err.message : "추적에 실패했습니다.");
    }
  };

  return (
    <PageLayout title={TEXT.title} description={TEXT.description}>
      <div className="mb-4">
        <Link to="/orders" className="text-sm font-semibold text-primary hover:underline">
          {TEXT.goOrders}
        </Link>
      </div>

      {loading && <p className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">불러오는 중...</p>}
      {!loading && error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {!loading && !error && !order && <p className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">{TEXT.notFound}</p>}

      {!loading && !error && order && (
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">{TEXT.orderNumber}</p>
                <p className="mt-1 text-sm font-semibold">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{TEXT.status}</p>
                <p className="mt-1 text-sm font-semibold">{order.status || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{TEXT.amount}</p>
                <p className="mt-1 text-sm font-semibold">{formatMoney(order.totalAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{TEXT.date}</p>
                <p className="mt-1 text-sm font-semibold">{formatDateTime(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{TEXT.payment}</p>
                <p className="mt-1 text-sm font-semibold">{order.paymentMethod || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{TEXT.address}</p>
                <p className="mt-1 text-sm font-semibold">{order.shippingAddress || "-"}</p>
              </div>
            </div>
            {order.receiptFilePath && (
              <a className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline" href={api.orders.downloadUrl(order.receiptFilePath)} target="_blank" rel="noreferrer">
                {TEXT.receipt}
              </a>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="mb-3 text-lg font-bold">{TEXT.itemHeader}</h2>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">{TEXT.emptyItems}</p>
            ) : (
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={`${item.bookId}-${idx}`} className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
                    <p>
                      {TEXT.bookId}: {item.bookId}
                    </p>
                    <p className="mt-0.5 text-muted-foreground">
                      {TEXT.qty}: {item.quantity} | {TEXT.unitPrice}: {formatMoney(item.unitPrice)} | {TEXT.lineTotal}: {formatMoney(item.lineTotal)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-col gap-2 md:flex-row">
              <input
                className="flex-1 rounded border border-input bg-background px-2 py-1.5 text-sm"
                placeholder={TEXT.trackingPlaceholder}
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
              />
              <button className="rounded bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90" onClick={track}>
                {TEXT.trackingButton}
              </button>
            </div>
            {trackingResult && (
              <p className="mt-2 text-xs text-muted-foreground">
                {TEXT.trackingResult}: {trackingResult}
              </p>
            )}
          </section>
        </div>
      )}
    </PageLayout>
  );
}
