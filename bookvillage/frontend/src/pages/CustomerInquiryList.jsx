import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api/client";
import PageLayout from "@/components/PageLayout";

const formatCreatedAt = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("ko-KR");
};

export default function CustomerInquiryList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const rows = (await api.customerService.list()) || [];
        if (!active) return;
        setList(rows);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "문의 목록을 불러오지 못했습니다.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const sortedList = useMemo(
    () => [...list].sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime()),
    [list],
  );

  return (
    <PageLayout title="내 문의 목록" description="등록한 1:1 문의 목록을 확인할 수 있습니다.">
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Link
            to="/customer-service?tab=inquiry"
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
          >
            문의 작성으로
          </Link>
        </div>

        {loading && (
          <p className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
            문의 목록을 불러오는 중입니다.
          </p>
        )}

        {!loading && error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && sortedList.length === 0 && (
          <p className="rounded-lg border border-dashed border-border bg-background px-3 py-4 text-sm text-muted-foreground">
            작성된 문의가 없습니다.
          </p>
        )}

        {!loading && !error && sortedList.length > 0 && (
          <div className="space-y-2">
            {sortedList.map((item) => (
              <article key={item.id} className="rounded-xl border border-border bg-background p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{item.subject || "(제목 없음)"}</p>
                  <span className="text-xs text-muted-foreground">{item.status}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{formatCreatedAt(item.createdAt)}</p>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                  {item.content || "내용이 없습니다."}
                </p>
                <Link
                  to={`/customer-service/inquiries/${item.id}`}
                  className="mt-3 inline-flex rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
                >
                  상세 보기
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageLayout>
  );
}
