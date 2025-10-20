import { formatCurrency } from "../../lib/format";
import type { Order } from "../../lib/api"; // define an Order type

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between mb-2">
        <span className="font-semibold">Order ID:</span>
        <span className="text-gray-600">{order._id}</span>
      </div>

      <div className="mb-2">
        <span className="font-semibold">Status:</span>{" "}
        <span className="text-blue-600">{order.status}</span>
      </div>

      <div className="mb-2">
        <span className="font-semibold">Total:</span>{" "}
        <span className="font-bold">{formatCurrency(order.total)}</span>
      </div>

      <div className="mb-2">
        <span className="font-semibold">Items:</span>
        <ul className="list-disc list-inside">
          {order.items.map((item) => (
            <li key={item.productId}>
              {item.name} × {item.quantity} ({formatCurrency(item.price)})
            </li>
          ))}
        </ul>
      </div>

      <div className="text-sm text-gray-500">
        Placed on: {new Date(order.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
