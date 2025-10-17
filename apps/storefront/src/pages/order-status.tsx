import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import InfoRow from "../components/atoms/InfoRow";
import { maskId, formatDate } from "../lib/format";
import { MainLayout } from "../components/templates/MainLayout";

interface OrderStatus {
  orderId: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  carrier?: string;
  estimatedDelivery?: string;
  updatedAt?: string;
}

export default function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    console.log("Connecting to SSE for order", id);

    const evtSource = new EventSource(
      `http://localhost:4000/api/orders/${id}/stream`
    );

    evtSource.addEventListener("status", (event) => {
      console.log("SSE received:", event.data);
      const data = JSON.parse(event.data);
      setOrder(data);
      setLoading(false);
      if (data.status === "DELIVERED") evtSource.close();
    });

    evtSource.addEventListener("error", (err) => {
      console.error("SSE error:", err);
      evtSource.close();
    });

    return () => evtSource.close();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 max-w-4xl mx-auto text-center">
          <p className="text-gray-600">Loading order status...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6 max-w-4xl mx-auto text-center text-red-600">
          {error}
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="p-6 max-w-4xl mx-auto text-center">
          <p className="text-gray-600">No order found.</p>
        </div>
      </MainLayout>
    );
  }

  const statusColor =
    order.status === "DELIVERED"
      ? "text-green-600"
      : order.status === "SHIPPED"
      ? "text-blue-600"
      : order.status === "PROCESSING"
      ? "text-orange-600"
      : "text-gray-700";

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Order Status</h1>

        <div className="bg-white border border-gray-200 rounded-lg shadow p-6 space-y-4">
          <InfoRow label="Order ID" value={maskId(order.orderId)} />
          <InfoRow
            label="Status"
            value={order.status}
            valueClassName={`font-bold ${statusColor}`}
          />
          {order.carrier && <InfoRow label="Carrier" value={order.carrier} />}
          {order.estimatedDelivery && (
            <InfoRow label="ETA" value={formatDate(order.estimatedDelivery)} />
          )}
          {order.updatedAt && (
            <InfoRow label="Last Updated" value={formatDate(order.updatedAt)} />
          )}
        </div>

        <div className="mt-6">
          <Link to="/" className="text-blue-600 hover:underline font-medium">
            ← Back to Catalog
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
