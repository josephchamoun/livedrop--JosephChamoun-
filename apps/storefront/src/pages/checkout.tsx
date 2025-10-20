// src/pages/checkout.tsx
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../lib/store";
import { createOrder } from "../lib/api";
import Button from "../components/atoms/Button";
import { formatCurrency } from "../lib/format";
import { MainLayout } from "../components/templates/MainLayout";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;

    const user = localStorage.getItem("user");
    if (!user) {
      alert("Please log in first");
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(user);

    try {
      // Convert CartItem[] to the backend format
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.qty, // only quantity needed
      }));

      const orderData = {
        customerEmail: parsedUser.email, // use email instead of _id
        items: orderItems,
        carrier: "FedEx",
        estimatedDelivery: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000
        ).toISOString(),
      };

      const order = await createOrder(orderData);

      clearCart();
      navigate(`/order/${order._id}`);
    } catch (err) {
      console.error("Failed to place order:", err);
      alert("Failed to place order. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="p-6 max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600">
            Add some products before checking out.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {/* Cart Summary */}
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-gray-600">
                  {formatCurrency(item.price)} × {item.qty}
                </p>
              </div>
              <div className="font-bold">
                {formatCurrency(item.price * item.qty)}
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded mb-6">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-lg font-bold">{formatCurrency(total)}</span>
        </div>

        {/* Place Order Button */}
        <Button onClick={handlePlaceOrder} className="w-full py-3">
          Place Order
        </Button>
      </div>
    </MainLayout>
  );
}
