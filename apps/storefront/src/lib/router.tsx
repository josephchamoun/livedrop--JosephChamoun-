// src/lib/router.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Catalog from "../pages/catalog";
import ProductPage from "../pages/product";
import CartPage from "../pages/cart";
import CheckoutPage from "../pages/checkout";
import OrderStatusPage from "../pages/order-status";
import ProfilePage from "../pages/profile";
import MyOrdersPage from "../pages/my-orders";
import LoginPage from "../components/UserLogin";
import Dashboard from "../pages/AdminDashboard";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/p/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/:id" element={<OrderStatusPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />{" "}
        {/* point to LoginPage */}
      </Routes>
    </BrowserRouter>
  );
}
