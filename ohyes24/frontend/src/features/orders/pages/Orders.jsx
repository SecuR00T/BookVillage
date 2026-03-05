import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Filter,
  MapPin,
  PackageCheck,
  Truck,
} from "lucide-react";
import { api } from "@/api/client";
import PageLayout from "@/components/PageLayout";

const TEXT = {
  title: "내 주문",
  description: "주문 현황, 결제 금액, 배송 상태를 한눈에 확인할 수 있습니다.",
  empty: "조건에 맞는 주문이 없습니다.",
  emptyAll: "아직 주문 내역이 없습니다.",
  goMypage: "마이페이지로 돌아가기",
  orderDetail: "주문 상세보기",
  receipt: "영수증 다운로드",
  loadFail: "주문 목록을 불러오지 못했습니다.",
  latestOrderDone: "주문이 정상적으로 완료되었습니다.",
  latestOrderNumber: "주문번호",
  latestOrderAmount: "결제금액",
  continueShopping: "쇼핑 계속하기",
  amount: "결제금액",
  payment: "결제수단",
  shippingAddress: "배송지",
  itemCount: "주문 수량",
  itemUnit: "개",
  helper: "배송 정보 확인과 취소/반품 요청은 주문 상세에서 진행할 수 있습니다.",
  totalOrders: "총 주문",
  inProgress: "진행 중",
  delivered: "배송 완료",
  totalSpend: "총 결제 금액",
  filterAll: "전체",
  filterProgress: "진행중",
  filterDelivered: "배송완료",
  filterIssue: "취소/반품",
};

const STATUS_LABEL = {
  PENDING: "결제 대기",
  PAID: "결제 완료",
  SHIPPED: "배송 중",
  DELIVERED: "배송 완료",
  CANCELLED: "주문 취소",
  CANCEL_REQUESTED: "취소 요청",
  RETURN_REQUESTED: "반품 요청",
  EXCHANGE_REQUESTED: "교환 요청",
};

const FILTERS = [
  { key: "ALL", label: TEXT.filterAll },
  { key: "PROGRESS", label: TEXT.filterProgress },
  { key: "DELIVERED", label: TEXT.filterDelivered },
  { key: "ISSUE", label: TEXT.filterIssue },
];

const PROGRESS_STATUSES = new Set(["PENDING", "PAID", "SHIPPED"]);
const ISSUE_STATUSES = new Set(["CANCELLED", "CANCEL_REQUESTED", "RETURN_REQUESTED", "EXCHANGE_REQUESTED"]);

const formatMoney = (value) => `${Number(value || 0).toLocaleString("ko-KR")} KRW`;

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeStatus = (status) => String(status || "").toUpperCase();

const statusLabel = (status) => STATUS_LABEL[normalizeStatus(status)] || (status || "-");

const statusBadgeClass = (status) => {
  const key = normalizeStatus(status);
  if (key === "DELIVERED") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (key === "SHIPPED") return "border-sky-200 bg-sky-50 text-sky-700";
  if (key === "PAID") return "border-amber-200 bg-amber-50 text-amber-700";
  if (ISSUE_STATUSES.has(key)) return "border-rose-200 bg-rose-50 text-rose-700";
  return "border-border bg-secondary text-foreground";
};

const filterByKey = (orders, key) => {
  if (key === "PROGRESS") return orders.filter((order) => PROGRESS_STATUSES.has(normalizeStatus(order.status)));
  if (key === "DELIVERED") return orders.filter((order) => normalizeStatus(order.status) === "DELIVERED");
  if (key === "ISSUE") return orders.filter((order) => ISSUE_STATUSES.has(normalizeStatus(order.status)));
  return orders;
};

export default function Orders() {
  const location = useLocation();
  const latestOrder = location.state?.latestOrder || null;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api.orders.list();
        if (!mounted) return;
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : TEXT.loadFail);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const mergedOrders = useMemo(() => {
    if (!latestOrder?.id) return orders;
    if (orders.some((order) => Number(order.id) === Number(latestOrder.id))) return orders;
    return [latestOrder, ...orders];
  }, [orders, latestOrder]);

  const sortedOrders = useMemo(() => {
    return [...mergedOrders].sort((a, b) => {
      const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [mergedOrders]);

  const filteredOrders = useMemo(() => filterByKey(sortedOrders, activeFilter), [sortedOrders, activeFilter]);

  const summary = useMemo(() => {
    const totalOrders = sortedOrders.length;
    const inProgress = sortedOrders.filter((order) => PROGRESS_STATUSES.has(normalizeStatus(order.status))).length;
    const delivered = sortedOrders.filter((order) => normalizeStatus(order.status) === "DELIVERED").length;
    const totalSpend = sortedOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    return { totalOrders, inProgress, delivered, totalSpend };
  }, [sortedOrders]);

  return (
    <PageLayout title={TEXT.title} description={TEXT.description}>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <Link to="/mypage" className="text-sm font-semibold text-primary hover:underline">
            {TEXT.goMypage}
          </Link>
        </div>

        {latestOrder?.orderNumber && (
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="mt-0.5 text-emerald-700" />
                <div>
                  <p className="text-sm font-bold text-emerald-800">{TEXT.latestOrderDone}</p>
                  <p className="mt-1 text-sm text-emerald-800">
                    {TEXT.latestOrderNumber}: <span className="font-semibold">{latestOrder.orderNumber}</span>
                  </p>
                  <p className="mt-1 text-sm text-emerald-700">{TEXT.latestOrderAmount}: {formatMoney(latestOrder.totalAmount)}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {latestOrder.id && (
                  <Link to={`/orders/${latestOrder.id}`} className="inline-flex h-9 items-center rounded-lg bg-emerald-700 px-3 text-xs font-semibold text-white hover:bg-emerald-800">
                    {TEXT.orderDetail}
                  </Link>
                )}
                <Link to="/books" className="inline-flex h-9 items-center rounded-lg border border-emerald-300 bg-white px-3 text-xs font-semibold text-emerald-800 hover:bg-emerald-100">
                  {TEXT.continueShopping}
                </Link>
              </div>
            </div>
          </section>
        )}

        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <ClipboardList size={14} />
              {TEXT.totalOrders}
            </p>
            <p className="mt-2 text-2xl font-extrabold">{summary.totalOrders}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Truck size={14} />
              {TEXT.inProgress}
            </p>
            <p className="mt-2 text-2xl font-extrabold">{summary.inProgress}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <PackageCheck size={14} />
              {TEXT.delivered}
            </p>
            <p className="mt-2 text-2xl font-extrabold">{summary.delivered}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <CircleDollarSign size={14} />
              {TEXT.totalSpend}
            </p>
            <p className="mt-2 text-2xl font-extrabold">{formatMoney(summary.totalSpend)}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 text-xs font-semibold text-muted-foreground">
              <Filter size={14} /> 필터
            </span>
            {FILTERS.map((filter) => {
              const active = activeFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active ? "bg-primary text-primary-foreground" : "border border-border bg-background text-foreground hover:bg-secondary"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </section>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-36 animate-pulse rounded-2xl border border-border bg-card/70" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <section className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">{sortedOrders.length === 0 ? TEXT.emptyAll : TEXT.empty}</p>
            <Link to="/books" className="mt-4 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90">
              도서 보러가기
            </Link>
          </section>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const itemCount = Array.isArray(order.items)
                ? order.items.reduce((sum, item) => sum + Number(item?.quantity || 0), 0)
                : 0;

              return (
                <article key={order.id || order.orderNumber} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-lg font-extrabold tracking-tight text-foreground">{order.orderNumber || "주문번호 없음"}</p>
                      <p className="mt-1 text-xs text-muted-foreground">주문일시: {formatDateTime(order.createdAt)}</p>
                    </div>
                    <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusBadgeClass(order.status)}`}>
                      {statusLabel(order.status)}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-border bg-background/80 p-3">
                      <p className="text-xs text-muted-foreground">{TEXT.amount}</p>
                      <p className="mt-1 text-sm font-bold">{formatMoney(order.totalAmount)}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/80 p-3">
                      <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <CreditCard size={13} />
                        {TEXT.payment}
                      </p>
                      <p className="mt-1 text-sm font-semibold">{order.paymentMethod || "-"}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/80 p-3">
                      <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={13} />
                        {TEXT.shippingAddress}
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold" title={order.shippingAddress || "-"}>
                        {order.shippingAddress || "-"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/80 p-3">
                      <p className="text-xs text-muted-foreground">{TEXT.itemCount}</p>
                      <p className="mt-1 text-sm font-semibold">
                        {itemCount} {TEXT.itemUnit}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {order.id && (
                      <Link
                        to={`/orders/${order.id}`}
                        className="inline-flex h-9 items-center rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:opacity-90"
                      >
                        {TEXT.orderDetail}
                      </Link>
                    )}
                    {order.receiptFilePath && (
                      <a
                        className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-xs font-semibold hover:bg-secondary"
                        href={api.orders.downloadUrl(order.receiptFilePath)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {TEXT.receipt}
                      </a>
                    )}
                    <p className="ml-auto text-xs text-muted-foreground">{TEXT.helper}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
