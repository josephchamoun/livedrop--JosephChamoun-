// components/organisms/Navbar.tsx
import { Link } from "react-router-dom";
import { useCartStore } from "../../lib/store";

export default function Navbar() {
  const { items } = useCartStore();

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/" className="font-bold text-xl text-blue-600">
          ShopLite
        </Link>
        <Link to="/profile" className="hover:underline">
          Profile
        </Link>
        <Link to="/my-orders" className="hover:underline">
          My Orders
        </Link>
      </div>
      <div>
        <Link to="/cart" className="relative">
          Cart ({items.length})
        </Link>
      </div>
    </nav>
  );
}
