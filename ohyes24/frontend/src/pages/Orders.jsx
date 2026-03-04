import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Truck } from "lucide-react";
import { api } from "@/api/client";
import PageLayout from "@/components/PageLayout";

const TEXT = {
  title: "내 주문",
  description: "주문 상태, 결제 금액, 배송 추적 정보를 확인할 수 있습니다.",
  empty: "주문 내역이 없습니다.",
  goMypage: "마이페이지로 돌아가기",
  status: "상태",
  amount: "결제금액",
  detail: "주문 상세보기",
  receipt: "영수증 다운로드",
  trackingPlaceholder: "배송 추적 URL 입력",
  trackingButton: "배송 추적",
  trackingResult: "추적 결과",
  loadFail: "주문 목록을 불러오지 못했습니다.",
  trackingFail: "배송 추적에 실패했습니다.",
};

const statusLabel = (status) => {
  const key = String(status || "").toUpperCase();
  const map = {
    PENDING: "결제 대기",
    PAID: "결제 완료",
    SHIPPED: "배송 중",
    DELIVERED: "배송 완료",
    CANCELLED: "주문 취소",
    CANCEL_REQUESTED: "취소 요청",
    RETURN_REQUESTED: "반품 요청",
  };
  return map[key] || (status || "-");
};

export default function Orders() {
  const location = useLocation();
  const latestOrder = location.state?.latestOrder || null;

  const [orders, setOrders] = useState([]);
  const [trackingUrl, setTrackingUrl] = useState({});
  const [trackingResult, setTrackingResult] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    api.orders
      .list()
      .then((v) => setOrders(v || []))
      .catch((err) => setError(err instanceof Error ? err.message : TEXT.loadFail));
  }, []);

  const mergedOrders = useMemo(() => {
    if (!latestOrder?.id) return orders;
    if (orders.some((order) => Number(order.id) === Number(latestOrder.id))) {
      return orders;
    }
    return [latestOrder, ...orders];
  }, [orders, latestOrder]);

  const track = async (orderId) => {
    const url = trackingUrl[orderId];
    if (!url) return;
    try {
      const result = await api.orders.track(orderId, url);
      const locationLabel = result?.currentLocation || "위치 확인 불가";
      const status = result?.status || "UNKNOWN";
      setTrackingResult((prev) => ({ ...prev, [orderId]: `${status} (${locationLabel})` }));
    } catch (err) {
      setTrackingResult((prev) => ({
        ...prev,
        [orderId]: err instanceof Error ? err.message : TEXT.trackingFail,
      }));
    }
  };

  return (
    <PageLayout title={TEXT.title} description={TEXT.description}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <Link to="/mypage" className="text-sm font-semibold text-primary hover:underline">
          {TEXT.goMypage}
        </Link>
      </div>

      {latestOrder?.orderNumber && (
        <section className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={20} className="mt-0.5 text-emerald-700" />
            <div>
              <p className="text-sm font-bold text-emerald-800">주문이 정상적으로 완료되었습니다.</p>
              <p className="mt-1 text-sm text-emerald-800">
                주문번호: <span className="font-semibold">{latestOrder.orderNumber}</span>
              </p>
              <p className="mt-1 text-sm text-emerald-700">
                결제금액: {Number(latestOrder.totalAmount || 0).toLocaleString("ko-KR")} KRW
              </p>
            </div>
          </div>
        </section>
      )}

      {error && <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      {mergedOrders.length === 0 ? (
        <p className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">{TEXT.empty}</p>
      ) : (
        <div className="space-y-3">
          {mergedOrders.map((order) => (
            <div key={order.id || order.orderNumber} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-base font-bold">{order.orderNumber}</p>
                <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">
                  {statusLabel(order.status)}
                </span>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {TEXT.amount}: <span className="font-semibold text-foreground">{Number(order.totalAmount || 0).toLocaleString("ko-KR")} KRW</span>
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                {order.id && (
                  <Link to={`/orders/${order.id}`} className="font-semibold text-primary hover:underline">
                    {TEXT.detail}
                  </Link>
                )}
                {order.receiptFilePath && (
                  <a
                    className="font-semibold text-primary hover:underline"
                    href={api.orders.downloadUrl(order.receiptFilePath)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {TEXT.receipt}
                  </a>
                )}
              </div>

              {order.id && (
                <div className="mt-3 rounded-xl border border-border bg-background p-3">
                  <p className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                    <Truck size={13} />
                    배송 추적
                  </p>
                  <div className="flex flex-col gap-2 md:flex-row">
                    <input
                      className="flex-1 rounded-lg border border-input bg-card px-3 py-2 text-sm"
                      placeholder={TEXT.trackingPlaceholder}
                      value={trackingUrl[order.id] || ""}
                      onChange={(e) => setTrackingUrl((prev) => ({ ...prev, [order.id]: e.target.value }))}
                    />
                    <button
                      className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                      onClick={() => track(order.id)}
                    >
                      {TEXT.trackingButton}
                    </button>
                  </div>
                  {trackingResult[order.id] && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {TEXT.trackingResult}: {trackingResult[order.id]}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
