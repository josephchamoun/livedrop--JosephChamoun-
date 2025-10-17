// src/lib/api.ts

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;


// -------------------- Types --------------------

// Customers
export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  [key: string]: unknown;
}

// Products
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  imageUrl: string;
  stock: number;
  [key: string]: unknown;
}

export interface ProductQueryParams {
  search?: string;
  tag?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

// Orders
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  carrier?: string;
  estimatedDelivery?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

// Analytics
export interface DailyRevenue {
  date: string;       // "2025-10-17"
  revenue: number;
  orderCount: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

// Admin Dashboard
export interface BusinessMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  ordersByStatus: {
    PENDING: number;
    PROCESSING: number;
    SHIPPED: number;
    DELIVERED: number;
  };
}

export interface PerformanceMetrics {
  apiLatencyMs: number;
  activeSSEConnections: number;
  llmResponseTimes: Record<string, number>; // by intent
  failedRequests: number;
}

export interface AssistantStats {
  totalQueries: number;
  intentDistribution: Record<string, number>;
  functionCalls: Record<string, number>;
  avgResponseTimeMs: Record<string, number>;
}

// -------------------- Customers --------------------
export async function getCustomerByEmail(email: string): Promise<Customer> {
  const res = await fetch(`${BASE_URL}/api/customers?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("Customer not found");
  return res.json();
}

export async function getCustomerById(id: string): Promise<Customer> {
  const res = await fetch(`${BASE_URL}/api/customers/${id}`);
  if (!res.ok) throw new Error("Customer not found");
  return res.json();
}

// -------------------- Products --------------------
export async function getProducts(params: ProductQueryParams = {}): Promise<Product[]> {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const res = await fetch(`${BASE_URL}/api/products?${query}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getProductById(id: string): Promise<Product> {
  console.log("🔍 Fetching:", `${BASE_URL}/api/products/${id}`);
  const res = await fetch(`${BASE_URL}/api/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}


export async function createProduct(data: Partial<Product>): Promise<Product> {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

// -------------------- Orders --------------------
export async function createOrder(order: {
  customerEmail: string;
  items: { productId: string; quantity: number }[];
  carrier?: string;
  estimatedDelivery?: string;
}) {
  const { data } = await axios.post(
    `${BASE_URL}/api/orders`,
    order,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return data;
}

export async function getOrderById(id: string): Promise<Order> {
  const res = await fetch(`${BASE_URL}/api/orders/${id}`);
  if (!res.ok) throw new Error("Order not found");
  return res.json();
}

export async function getOrdersByCustomerId(customerId: string) {
  const res = await fetch(`http://localhost:4000/api/orders?customerId=${customerId}`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}
// -------------------- Analytics --------------------
export async function getDailyRevenue(from: string, to: string): Promise<DailyRevenue[]> {
  const res = await fetch(`${BASE_URL}/api/analytics/daily-revenue?from=${from}&to=${to}`);
  if (!res.ok) throw new Error("Failed to fetch daily revenue");
  return res.json();
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const res = await fetch(`${BASE_URL}/api/analytics/dashboard-metrics`);
  if (!res.ok) throw new Error("Failed to fetch dashboard metrics");
  return res.json();
}

// -------------------- Admin Dashboard --------------------
export async function getBusinessMetrics(): Promise<BusinessMetrics> {
  const res = await fetch(`${BASE_URL}/api/dashboard/business-metrics`);
  if (!res.ok) throw new Error("Failed to fetch business metrics");
  return res.json();
}

export async function getPerformanceMetrics(): Promise<PerformanceMetrics> {
  const res = await fetch(`${BASE_URL}/api/dashboard/performance`);
  if (!res.ok) throw new Error("Failed to fetch performance metrics");
  return res.json();
}

export async function getAssistantStats(): Promise<AssistantStats> {
  const res = await fetch(`${BASE_URL}/api/dashboard/assistant-stats`);
  if (!res.ok) throw new Error("Failed to fetch assistant stats");
  return res.json();
}

// -------------------- Aliases (Optional) --------------------
export const listProducts = getProducts; // backward compatibility
