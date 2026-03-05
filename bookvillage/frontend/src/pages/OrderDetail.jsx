import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "@/api/client";
import PageLayout from "@/components/PageLayout";

const TEXT = {
  title: "주문 상세",
  description: "주문 정보와 상품, 배송 정보, 취소/반품/교환 요청 상태를 확인할 수 있습니다.",
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
  actionHeader: "취소/반품/교환 요청",
  cancelButton: "주문 취소 요청",
  refundButton: "환불(반품) 요청",
  exchangeButton: "교환 요청",
  reasonLabel: "요청 사유",
  reasonPlaceholder: "요청 사유를 입력해 주세요.",
  proofLabel: "증빙 파일명(선택)",
  proofPlaceholder: "예: damaged_box.jpg",
  actionProcessing: "처리 중...",
  cancelDone: "취소 요청이 접수되었습니다.",
  refundDone: "환불(반품) 요청이 접수되었습니다.",
  exchangeDone: "교환 요청이 접수되었습니다.",
  actionBlocked: "현재 상태에서는 취소/반품/교환 요청을 할 수 없습니다.",
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
    RETURN_REQUESTED: "환불(반품) 요청",
    EXCHANGE_REQUESTED: "교환 요청",
  };
  return map[key] || (status || "-");
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
  const [reason, setReason] = useState("");
  const [proofFileName, setProofFileName] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadOrder = async () => {
    if (!orderId) return;
    setLoading(true);
    setError("");
    try {
      const value = await api.orders.get(orderId);
      setOrder(value || null);
    } catch (err) {
      setOrder(null);
      setError(err instanceof Error ? err.message : TEXT.loadFail);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const items = useMemo(
    () => (order?.items || []).map((v) => ({ ...v, lineTotal: Number(v.quantity || 0) * Number(v.unitPrice || 0) })),
    [order],
  );

  const normalizedStatus = String(order?.status || "").toUpperCase();
  const canCancel = normalizedStatus === "PENDING" || normalizedStatus === "PAID";
  const canRefund = normalizedStatus === "SHIPPED" || normalizedStatus === "DELIVERED";
  const canExchange = normalizedStatus === "SHIPPED" || normalizedStatus === "DELIVERED";

  const requestCancel = async () => {
    if (!order?.id || !canCancel) return;
    if (!window.confirm("이 주문을 취소 요청할까요?")) return;

    setActionLoading(true);
    setActionError("");
    setActionMessage("");
    try {
      await api.mypage.cancelOrder(order.id, reason.trim() || "사용자 요청");
      setActionMessage(TEXT.cancelDone);
      await loadOrder();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "취소 요청에 실패했습니다.");
    } finally {
      setActionLoading(false);
    }
  };

  const requestRefund = async () => {
    if (!order?.id || !canRefund) return;
    if (!window.confirm("환불(반품) 요청을 접수할까요?")) return;

    setActionLoading(true);
    setActionError("");
    setActionMessage("");
    try {
      await api.mypage.returnOrder(order.id, reason.trim() || "사용자 요청", proofFileName.trim() || undefined);
      setActionMessage(TEXT.refundDone);
      await loadOrder();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "환불 요청에 실패했습니다.");
    } finally {
      setActionLoading(false);
    }
  };

  const requestExchange = async () => {
    if (!order?.id || !canExchange) return;
    if (!window.confirm("교환 요청을 접수할까요?")) return;

    setActionLoading(true);
    setActionError("");
    setActionMessage("");
    try {
      await api.mypage.exchangeOrder(order.id, reason.trim() || "사용자 요청", proofFileName.trim() || undefined);
      setActionMessage(TEXT.exchangeDone);
      await loadOrder();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "교환 요청에 실패했습니다.");
    } finally {
      setActionLoading(false);
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
                <p className="mt-1 text-sm font-semibold">{statusLabel(order.status)}</p>
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
            <h2 className="mb-3 text-lg font-bold">{TEXT.actionHeader}</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block text-xs text-muted-foreground">{TEXT.reasonLabel}</span>
                <input
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={TEXT.reasonPlaceholder}
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-xs text-muted-foreground">{TEXT.proofLabel}</span>
                <input
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  value={proofFileName}
                  onChange={(e) => setProofFileName(e.target.value)}
                  placeholder={TEXT.proofPlaceholder}
                />
              </label>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={requestCancel}
                disabled={!canCancel || actionLoading}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading ? TEXT.actionProcessing : TEXT.cancelButton}
              </button>
              <button
                type="button"
                onClick={requestRefund}
                disabled={!canRefund || actionLoading}
                className="rounded-lg border border-amber-200 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading ? TEXT.actionProcessing : TEXT.refundButton}
              </button>
              <button
                type="button"
                onClick={requestExchange}
                disabled={!canExchange || actionLoading}
                className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading ? TEXT.actionProcessing : TEXT.exchangeButton}
              </button>
            </div>

            {!canCancel && !canRefund && !canExchange && (
              <p className="mt-2 text-xs text-muted-foreground">{TEXT.actionBlocked}</p>
            )}
            {actionError && <p className="mt-2 text-xs text-red-600">{actionError}</p>}
            {actionMessage && <p className="mt-2 text-xs text-emerald-700">{actionMessage}</p>}
          </section>

        </div>
      )}
    </PageLayout>
  );
}
