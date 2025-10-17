import { useEffect, useState } from "react";
import { MainLayout } from "../components/templates/MainLayout";
import OrderCard from "../components/molecules/OrderCard";
import { getOrdersByCustomerId, type Order } from "../lib/api";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // get logged-in user from localStorage
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const data = await getOrdersByCustomerId(user._id);
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <MainLayout>
        <div className="p-6 max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">My Orders</h1>
          <p className="text-gray-600">Please log in to view your orders.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        {loading && <p>Loading orders...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && orders.length === 0 && <p>No orders found.</p>}

        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
