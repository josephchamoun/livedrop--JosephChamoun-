// src/lib/router.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Catalog from "../pages/catalog";
import ProductPage from "../pages/product";
import CartPage from "../pages/cart";
import CheckoutPage from "../pages/checkout";
import OrderStatusPage from "../pages/order-status";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/p/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/:id" element={<OrderStatusPage />} />
      </Routes>
    </BrowserRouter>
  );
}
