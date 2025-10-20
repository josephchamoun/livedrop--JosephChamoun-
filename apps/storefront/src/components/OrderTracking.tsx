import { useEffect, useState } from "react";

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

  useEffect(() => {
    const evtSource = new EventSource(
      `http://localhost:4000/api/orders/${orderId}/stream`
    );

    evtSource.addEventListener("status", (event) => {
      const data = JSON.parse((event as MessageEvent).data);
      setOrder(data);
      setLoading(false);

      if (data.status === "DELIVERED") {
        evtSource.close();
      }
    });

    evtSource.addEventListener("error", (err) => {
      console.error("SSE error:", err);
      evtSource.close();
    });

    return () => {
      evtSource.close();
    };
  }, [orderId]);

  if (loading) return <p>Loading order status...</p>;
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
