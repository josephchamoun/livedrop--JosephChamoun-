// /src/components/templates/MainLayout.tsx
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import SupportPanel from "../organisms/SupportPanel";
import { useCartStore } from "../../lib/store";

export function MainLayout({ children }: { children: ReactNode }) {
  const { items } = useCartStore();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar/Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            LiveDrop
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
      </header>

      <main className="flex-1 container mx-auto p-4">{children}</main>

      <footer className="bg-gray-100 text-center p-4 text-sm text-gray-600">
        © {new Date().getFullYear()} LiveDrop
      </footer>

      {/* SupportPanel visible everywhere */}
      <SupportPanel />
    </div>
  );
}
