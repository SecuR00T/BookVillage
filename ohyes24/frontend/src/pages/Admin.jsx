import { useEffect, useState } from "react";
import { api } from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import PageLayout from "@/components/PageLayout";

export default function Admin() {
  const { isAdmin } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [noticeForm, setNoticeForm] = useState({ title: "", content: "" });

  const load = async () => {
    const [d, b, o, u] = await Promise.all([
      api.admin.dashboard(),
      api.admin.getBooks(),
      api.admin.getOrders(),
      api.admin.getUsers(),
    ]);
    setDashboard(d);
    setBooks(b || []);
    setOrders(o || []);
    setUsers(u || []);
  };

  useEffect(() => {
    if (!isAdmin) return;
    load();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <PageLayout title="Admin" description="Admin privileges required.">
        <p className="text-muted-foreground">관리자 권한이 필요합니다.</p>
      </PageLayout>
    );
  }

  const changeOrderStatus = async (orderId, status) => {
    await api.admin.updateOrderStatus(orderId, status);
    load();
  };

  const changeUserStatus = async (userId, status) => {
    await api.admin.updateUserStatus(userId, status);
    load();
  };

  const postNotice = async () => {
    if (!noticeForm.title || !noticeForm.content) return;
    await api.admin.createNotice(noticeForm.title, noticeForm.content);
    setNoticeForm({ title: "", content: "" });
  };

  return (
    <PageLayout title="Admin" description="Dashboard and secure learning operations.">
      {dashboard && (
        <section className="bg-card border rounded-xl p-4 mb-4 grid md:grid-cols-5 gap-2 text-sm">
          <div>Users: <strong>{dashboard.totalUsers}</strong></div>
          <div>Books: <strong>{dashboard.totalBooks}</strong></div>
          <div>Orders: <strong>{dashboard.totalOrders}</strong></div>
          <div>Open Inquiries: <strong>{dashboard.openInquiries}</strong></div>
          <div>Lab Events: <strong>{dashboard.securityEvents}</strong></div>
        </section>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <section className="bg-card border rounded-xl p-4">
          <h2 className="font-bold mb-2">Orders</h2>
          <div className="space-y-2 max-h-96 overflow-auto">
            {orders.map((o) => (
              <div key={o.id} className="border rounded p-2 text-sm">
                <p className="font-semibold">{o.orderNumber}</p>
                <p>Status: {o.status}</p>
                <div className="flex gap-2 mt-1">
                  <button className="px-2 py-1 text-xs rounded bg-secondary" onClick={() => changeOrderStatus(o.id, "PENDING")}>PENDING</button>
                  <button className="px-2 py-1 text-xs rounded bg-secondary" onClick={() => changeOrderStatus(o.id, "SHIPPED")}>SHIPPED</button>
                  <button className="px-2 py-1 text-xs rounded bg-secondary" onClick={() => changeOrderStatus(o.id, "DELIVERED")}>DELIVERED</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card border rounded-xl p-4">
          <h2 className="font-bold mb-2">Users</h2>
          <div className="space-y-2 max-h-96 overflow-auto">
            {users.map((u) => (
              <div key={u.id} className="border rounded p-2 text-sm">
                <p className="font-semibold">{u.email}</p>
                <p>Role: {u.role} · Status: {u.status}</p>
                <div className="flex gap-2 mt-1">
                  <button className="px-2 py-1 text-xs rounded bg-secondary" onClick={() => changeUserStatus(u.id, "ACTIVE")}>ACTIVE</button>
                  <button className="px-2 py-1 text-xs rounded bg-secondary" onClick={() => changeUserStatus(u.id, "SUSPENDED")}>SUSPENDED</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="bg-card border rounded-xl p-4 mt-4">
        <h2 className="font-bold mb-2">Books</h2>
        <p className="text-sm text-muted-foreground">Total {books.length} books</p>
      </section>

      <section className="bg-card border rounded-xl p-4 mt-4">
        <h2 className="font-bold mb-2">Post Notice</h2>
        <div className="grid gap-2 md:grid-cols-2">
          <input className="border rounded px-3 py-2" placeholder="Title" value={noticeForm.title} onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Content" value={noticeForm.content} onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })} />
        </div>
        <button className="mt-2 px-3 py-2 rounded bg-primary text-white" onClick={postNotice}>Create Notice</button>
      </section>
    </PageLayout>
  );
}
