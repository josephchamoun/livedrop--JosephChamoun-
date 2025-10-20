import { useEffect, useState } from "react";
import { subscribeToOrderStatus } from "../lib/api";

interface OrderStatus {
  orderId: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  carrier?: string;
  estimatedDelivery?: string;
  updatedAt?: string;
}

interface Props {
  orderId: string;
}

export function OrderTracking({ orderId }: Props) {
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Use the API helper which automatically uses the correct URL
    const unsubscribe = subscribeToOrderStatus(
      orderId,
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
  }, [orderId]);

  if (loading) return <p>Loading order status...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!order) return <p>No order found.</p>;

  return (
    <div>
      <p>Order ID: {order.orderId}</p>
      <p>Status: {order.status}</p>
      <p>Carrier: {order.carrier || "N/A"}</p>
      <p>ETA: {order.estimatedDelivery || "N/A"}</p>
      <p>Last updated: {order.updatedAt || "N/A"}</p>
    </div>
  );
}
