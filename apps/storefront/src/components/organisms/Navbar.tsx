import { Link } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Package,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { useCartStore } from "../../lib/store";

export function Navbar() {
  const { items } = useCartStore();
  const cartCount = items.length;

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-700 to-blue-800 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* --- Left Side: Logo --- */}
          <Link
            to="/"
            className="group flex items-center space-x-2 transition-transform duration-300 hover:scale-105"
          >
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg group-hover:bg-white/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-2xl text-white tracking-tight group-hover:tracking-wide transition-all">
              LiveDrop
            </span>
          </Link>

          {/* --- Center: Navigation Links --- */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/profile"
              className="group flex items-center space-x-2 px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Profile</span>
            </Link>

            <Link
              to="/my-orders"
              className="group flex items-center space-x-2 px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              <Package className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">My Orders</span>
            </Link>

            <Link
              to="/dashboard"
              className="group flex items-center space-x-2 px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </div>

          {/* --- Right Side: Cart Button --- */}
          <Link to="/cart" className="group relative">
            <div className="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full flex items-center space-x-2 hover:bg-white/30 transition-all duration-300 group-hover:scale-105">
              <ShoppingCart className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Cart</span>

              {/* Cart Badge */}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
