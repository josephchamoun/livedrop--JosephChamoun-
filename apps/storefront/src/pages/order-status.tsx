// src/pages/OrderStatusPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { subscribeToOrderStatus } from "../lib/api";
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
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    // Use the API helper which automatically uses the correct URL from env
    const unsubscribe = subscribeToOrderStatus(
      id,
      (data) => {
        setOrder(data as OrderStatus);
        setLoading(false);
        setError("");
      },
      (err) => {
        console.error("SSE error:", err);
        setError("Failed to connect to order updates");
        setLoading(false);
      }
    );

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 max-w-4xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order status...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6 max-w-4xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <Link to="/" className="text-blue-600 hover:underline font-medium">
              ← Back to Catalog
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="p-6 max-w-4xl mx-auto text-center">
          <p className="text-gray-600 mb-4">No order found.</p>
          <Link to="/" className="text-blue-600 hover:underline font-medium">
            ← Back to Catalog
          </Link>
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

        <div className="mt-6 flex items-center space-x-4">
          <Link to="/" className="text-blue-600 hover:underline font-medium">
            ← Back to Catalog
          </Link>
          {order.status !== "DELIVERED" && (
            <span className="text-sm text-gray-500">
              • Updates automatically
            </span>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
