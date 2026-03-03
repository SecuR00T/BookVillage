import { useState } from "react";
import { api } from "@/api/client";
import PageLayout from "@/components/PageLayout";

export default function GuestOrderLookup() {
  const [orderNumber, setOrderNumber] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const lookup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await api.orders.lookup(orderNumber);
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Lookup failed");
    }
  };

  return (
    <PageLayout title="Guest Order Lookup" description="Lookup limited order summary by order number.">
      <form onSubmit={lookup} className="max-w-md flex gap-2">
        <input className="flex-1 border rounded-lg px-3 py-2" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="ORD-XXXXXXXX" />
        <button className="bg-primary text-white rounded-lg px-4">Lookup</button>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {result && (
        <div className="bg-card border rounded-xl p-4 mt-4">
          <p className="font-semibold">{result.orderNumber}</p>
          <p className="text-sm">Status: {result.status}</p>
          <p className="text-sm">Amount: {Number(result.totalAmount).toLocaleString()} KRW</p>
          <p className="text-sm">Shipping: {result.maskedShippingAddress}</p>
        </div>
      )}
    </PageLayout>
  );
}
