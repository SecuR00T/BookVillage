import { useEffect, useMemo, useState } from "react";
import { api } from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import PageLayout from "@/components/PageLayout";

const formatDateTime = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("ko-KR");
};

export default function Admin() {
  const { isAdmin } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  const [noticeForm, setNoticeForm] = useState({ title: "", content: "" });
  const [userControls, setUserControls] = useState({});
  const [replyDrafts, setReplyDrafts] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [d, b, o, u, c] = await Promise.all([
        api.admin.dashboard(),
        api.admin.getBooks(),
        api.admin.getOrders(),
        api.admin.getUsers(),
        api.admin.getCustomerService(),
      ]);

      const userRows = u || [];
      const inquiryRows = c || [];

      setDashboard(d || null);
      setBooks(b || []);
      setOrders(o || []);
      setUsers(userRows);
      setInquiries(inquiryRows);

      setUserControls((prev) => {
        const next = {};
        userRows.forEach((row) => {
          const existing = prev[row.id] || {};
          next[row.id] = {
            status: existing.status || row.status || "ACTIVE",
            role: existing.role || row.role || "USER",
          };
        });
        return next;
      });

      setReplyDrafts((prev) => {
        const next = {};
        inquiryRows.forEach((row) => {
          next[row.id] = prev[row.id] ?? row.adminAnswer ?? "";
        });
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "������ �����͸� �ҷ����� ���߽��ϴ�.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    load();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <PageLayout title="������" description="������ ���� ����Դϴ�.">
        <p className="text-muted-foreground">������ ������ �ʿ��մϴ�.</p>
      </PageLayout>
    );
  }

  const openInquiryCount = useMemo(
    () => inquiries.filter((v) => String(v.status || "").toUpperCase() === "OPEN").length,
    [inquiries],
  );

  const changeOrderStatus = async (orderId, status) => {
    setError("");
    setMessage("");
    try {
      await api.admin.updateOrderStatus(orderId, status);
      setMessage("�ֹ� ���¸� �����߽��ϴ�.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "�ֹ� ���� ���濡 �����߽��ϴ�.");
    }
  };

  const changeUserControl = (userId, key, value) => {
    setUserControls((prev) => ({
      ...prev,
      [userId]: {
        status: prev[userId]?.status || "ACTIVE",
        role: prev[userId]?.role || "USER",
        [key]: value,
      },
    }));
  };

  const applyUserControl = async (userId) => {
    const control = userControls[userId] || {};
    setError("");
    setMessage("");
    try {
      await api.admin.updateUserStatus(userId, control.status, control.role);
      setMessage("ȸ�� ����/������ �����߽��ϴ�.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ȸ�� ����/���� ���濡 �����߽��ϴ�.");
    }
  };

  const postNotice = async () => {
    if (!noticeForm.title.trim() || !noticeForm.content.trim()) return;
    setError("");
    setMessage("");
    try {
      await api.admin.createNotice(noticeForm.title.trim(), noticeForm.content.trim());
      setNoticeForm({ title: "", content: "" });
      setMessage("���������� ��ϵǾ����ϴ�.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "���� ��Ͽ� �����߽��ϴ�.");
    }
  };

  const replyInquiry = async (inquiryId) => {
    const answer = String(replyDrafts[inquiryId] || "").trim();
    if (!answer) {
      setError("�亯 ������ �Է��� �ּ���.");
      return;
    }

    setError("");
    setMessage("");
    try {
      await api.admin.replyCustomerService(inquiryId, answer);
      setMessage("���� �亯�� ����Ǿ����ϴ�.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "���� �亯 ���忡 �����߽��ϴ�.");
    }
  };

  return (
    <PageLayout title="������" description="ȸ��/�ֹ�/����/���� � ���">
      {dashboard && (
        <section className="mb-4 grid gap-2 rounded-xl border bg-card p-4 text-sm md:grid-cols-5">
          <div>ȸ��: <strong>{dashboard.totalUsers}</strong></div>
          <div>����: <strong>{dashboard.totalBooks}</strong></div>
          <div>�ֹ�: <strong>{dashboard.totalOrders}</strong></div>
          <div>�̴亯 ����: <strong>{openInquiryCount}</strong></div>
          <div>���� �̺�Ʈ: <strong>{dashboard.securityEvents}</strong></div>
        </section>
      )}

      {loading && <p className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">������ �����͸� �ҷ����� ���Դϴ�.</p>}
      {error && <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {message && <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}

      {!loading && (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-xl border bg-card p-4">
              <h2 className="mb-2 font-bold">�ֹ� ����</h2>
              <div className="max-h-96 space-y-2 overflow-auto">
                {orders.map((o) => (
                  <div key={o.id} className="rounded border p-2 text-sm">
                    <p className="font-semibold">{o.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">����: {o.status} | �ݾ�: {Number(o.totalAmount || 0).toLocaleString("ko-KR")} KRW</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED", "RETURN_REQUESTED", "EXCHANGE_REQUESTED"].map((status) => (
                        <button
                          key={status}
                          className="rounded bg-secondary px-2 py-1 text-xs"
                          onClick={() => changeOrderStatus(o.id, status)}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-sm text-muted-foreground">�ֹ� �����Ͱ� �����ϴ�.</p>}
              </div>
            </section>

            <section className="rounded-xl border bg-card p-4">
              <h2 className="mb-2 font-bold">ȸ�� ���� ����</h2>
              <div className="max-h-96 space-y-2 overflow-auto">
                {users.map((u) => {
                  const control = userControls[u.id] || { status: u.status || "ACTIVE", role: u.role || "USER" };
                  return (
                    <div key={u.id} className="rounded border p-2 text-sm">
                      <p className="font-semibold">#{u.id} {u.email}</p>
                      <p className="text-xs text-muted-foreground">���� ����: {u.status} | ���� ����: {u.role}</p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                        <select
                          className="rounded border border-input bg-background px-2 py-1.5 text-xs"
                          value={control.status}
                          onChange={(e) => changeUserControl(u.id, "status", e.target.value)}
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="SUSPENDED">SUSPENDED</option>
                          <option value="INACTIVE">INACTIVE</option>
                        </select>
                        <select
                          className="rounded border border-input bg-background px-2 py-1.5 text-xs"
                          value={control.role}
                          onChange={(e) => changeUserControl(u.id, "role", e.target.value)}
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => applyUserControl(u.id)}
                          className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                        >
                          ����
                        </button>
                      </div>
                    </div>
                  );
                })}
                {users.length === 0 && <p className="text-sm text-muted-foreground">ȸ�� �����Ͱ� �����ϴ�.</p>}
              </div>
            </section>
          </div>

          <section className="mt-4 rounded-xl border bg-card p-4">
            <h2 className="mb-2 font-bold">������� ���� �亯</h2>
            <div className="max-h-[520px] space-y-3 overflow-auto">
              {inquiries.map((q) => (
                <div key={q.id} className="rounded-xl border p-3">
                  <p className="text-sm font-semibold">#{q.id} {q.subject || "(���� ����)"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ����: {q.status} | ȸ��: {q.userId || "-"} | �ۼ���: {formatDateTime(q.createdAt)}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap rounded-lg bg-background px-3 py-2 text-sm">{q.content || "���� ������ �����ϴ�."}</p>
                  <textarea
                    className="mt-2 h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    placeholder="��� �亯�� �Է��ϼ���"
                    value={replyDrafts[q.id] || ""}
                    onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">���� �亯: {q.adminAnswer ? "����" : "����"}</p>
                    <button
                      type="button"
                      onClick={() => replyInquiry(q.id)}
                      className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                    >
                      �亯 ����
                    </button>
                  </div>
                </div>
              ))}
              {inquiries.length === 0 && <p className="text-sm text-muted-foreground">���� �����Ͱ� �����ϴ�.</p>}
            </div>
          </section>

          <section className="mt-4 rounded-xl border bg-card p-4">
            <h2 className="mb-2 font-bold">���� ���</h2>
            <p className="mb-2 text-xs text-muted-foreground">���� ���� ��: {books.length}</p>
            <div className="grid gap-2 md:grid-cols-2">
              <input
                className="rounded border px-3 py-2"
                placeholder="����"
                value={noticeForm.title}
                onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
              />
              <input
                className="rounded border px-3 py-2"
                placeholder="����"
                value={noticeForm.content}
                onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
              />
            </div>
            <button className="mt-2 rounded bg-primary px-3 py-2 text-white" onClick={postNotice}>���� ���</button>
          </section>
        </>
      )}
    </PageLayout>
  );
}
