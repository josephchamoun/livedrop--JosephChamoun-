import { useEffect, useState } from "react";
import { getOrdersByCustomer, type Order } from "../lib/api";
import { MainLayout } from "../components/templates/MainLayout";
import OrderCard from "../components/molecules/OrderCard";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return;

    const { _id } = JSON.parse(user);

    getOrdersByCustomer(_id)
      .then((data) => setOrders(data))
      .catch((err) => console.error("Failed to load orders:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 text-center">Loading your orders...</div>
      </MainLayout>
    );
  }

  if (orders.length === 0) {
    return (
      <MainLayout>
        <div className="p-6 text-center text-gray-500">
          You have no orders yet.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </MainLayout>
  );
}
