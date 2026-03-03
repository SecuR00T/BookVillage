import { useEffect, useState } from "react";
import { api } from "@/api/client";
import PageLayout from "@/components/PageLayout";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [trackingUrl, setTrackingUrl] = useState({});
  const [trackingResult, setTrackingResult] = useState({});

  useEffect(() => {
    api.orders.list().then((v) => setOrders(v || []));
  }, []);

  const track = async (orderId) => {
    const url = trackingUrl[orderId];
    if (!url) return;
    const result = await api.orders.track(orderId, url);
    setTrackingResult((prev) => ({ ...prev, [orderId]: `${result.status} (${result.currentLocation})` }));
  };

  return (
    <PageLayout title="Order History" description="Check status, receipt, and tracking simulation for your recent orders.">
      <div className="space-y-2">
        {orders.map((o) => (
          <div key={o.id} className="bg-card border rounded-xl p-4 space-y-2">
            <p className="font-semibold">{o.orderNumber}</p>
            <p className="text-sm">Status: {o.status}</p>
            <p className="text-sm">Amount: {Number(o.totalAmount).toLocaleString()} KRW</p>
            {o.receiptFilePath && (
              <a className="text-primary text-sm" href={api.orders.downloadUrl(o.receiptFilePath)} target="_blank" rel="noreferrer">
                Download receipt
              </a>
            )}
            <div className="flex flex-col md:flex-row gap-2">
              <input
                className="border rounded px-2 py-1 text-sm flex-1"
                placeholder="Tracking URL (learning simulation)"
                value={trackingUrl[o.id] || ""}
                onChange={(e) => setTrackingUrl((prev) => ({ ...prev, [o.id]: e.target.value }))}
              />
              <button className="px-3 py-1 rounded bg-primary text-white text-sm" onClick={() => track(o.id)}>Track</button>
            </div>
            {trackingResult[o.id] && <p className="text-xs text-muted-foreground">Tracking: {trackingResult[o.id]}</p>}
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
