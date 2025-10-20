/* eslint-disable @typescript-eslint/no-explicit-any */

// ==================== TYPE DEFINITIONS ====================

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl: string;
  tags: string[];
  stock: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  carrier?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  qty: number;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  createdAt: string;
}

export interface DashboardMetrics {
  business: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    ordersByStatus: Array<{ status: string; count: number }>;
  };
  performance: {
    avgLatency: number;
    activeSSEConnections: number;
    failedRequests: number;
    llmAvgResponseTime?: number;
    totalRequests?: number;
  };
  assistant: {
    totalQueries: number;
    intentDistribution: Array<{ intent: string; count: number }>;
    functionFrequency: Array<{ function: string; count: number }>;
    avgResponseTimeByIntent?: Array<{ 
      intent: string; 
      avgResponseTime: number; 
      count: number 
    }>;
  };
  health: {
    dbStatus: string;
    llmStatus: string;
    lastUpdate?: string;
  };
  revenue: Array<{ date: string; revenue: number; orderCount: number }>;
}

export interface AssistantResponse {
  text: string;
  intent: string;
  functionsCalled: string[];
  citations: string[];
  citationValidation: {
    isValid: boolean;
    valid: string[];
    invalid: string[];
  };
  responseTime: number;
  metadata?: {
    responseTime: string;
    timestamp: string;
  };
}

// ==================== API HELPERS ====================

const API_BASE = import.meta.env.VITE_API_URL || "https://livedrop-josephchamoun.onrender.com/api";

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    let errorMessage = `API Error ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      errorMessage = await res.text() || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

// Helper functions for date formatting
function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
}

function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

// ==================== PRODUCTS ====================

// Add this interface near your other type definitions
export interface PaginatedProductsResponse {
  [x: string]: any;
  forEach(arg0: (p: any) => any): unknown;
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * Get all products with optional filters and pagination
 */
export async function getProducts(params?: {
  search?: string;
  tag?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedProductsResponse> {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.tag) query.append('tag', params.tag);
  if (params?.sort) query.append('sort', params.sort);
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());

  const url = `${API_BASE}/products${query.toString() ? `?${query.toString()}` : ''}`;
  return fetchJSON<PaginatedProductsResponse>(url);
}

/**
 * Get single product by ID
 */
export async function getProductById(id: string): Promise<Product> {
  return fetchJSON<Product>(`${API_BASE}/products/${id}`);
}

/**
 * Create new product
 */
export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  category?: string;
  tags: string[];
  imageUrl: string;
  stock: number;
}): Promise<Product> {
  return fetchJSON<Product>(`${API_BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ==================== CUSTOMERS ====================

/**
 * Get customer by email (simple identification, no auth)
 */
export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  const url = `${API_BASE}/customers?email=${encodeURIComponent(email)}`;
  try {
    const customer = await fetchJSON<Customer>(url);
    return customer || null;
  } catch (err: any) {
    if (err.message.includes("404") || err.message.includes("not found")) {
      return null;
    }
    throw err;
  }
}

/**
 * Get customer by ID
 */
export async function getCustomerById(id: string): Promise<Customer> {
  return fetchJSON<Customer>(`${API_BASE}/customers/${id}`);
}

// ==================== ORDERS ====================

export interface CreateOrderData {
  customerEmail: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  carrier: string;
  estimatedDelivery: string;
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string): Promise<Order> {
  return fetchJSON<Order>(`${API_BASE}/orders/${orderId}`);
}

/**
 * Create a new order
 */
export async function createOrder(data: CreateOrderData): Promise<Order> {
  return fetchJSON<Order>(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/**
 * Get all orders by a specific customer
 */
export async function getOrdersByCustomer(customerId: string): Promise<Order[]> {
  return fetchJSON<Order[]>(`${API_BASE}/orders?customerId=${customerId}`);
}


// ==================== ANALYTICS ====================

/**
 * Get daily revenue data for a date range
 */
export async function getDailyRevenue(from: string, to: string): Promise<
  Array<{ date: string; revenue: number; orderCount: number }>
> {
  return fetchJSON(`${API_BASE}/analytics/daily-revenue?from=${from}&to=${to}`);
}

// ==================== DASHBOARD ====================

/**
 * Get all dashboard metrics in one call
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    // Fetch all dashboard data in parallel
    const [business, performance, assistant, health, revenue] = await Promise.all([
      fetch(`${API_BASE}/dashboard/business-metrics`).then(r => {
        if (!r.ok) throw new Error(`Business metrics failed: ${r.status}`);
        return r.json();
      }),
      fetch(`${API_BASE}/dashboard/performance`).then(r => {
        if (!r.ok) throw new Error(`Performance failed: ${r.status}`);
        return r.json();
      }),
      fetch(`${API_BASE}/dashboard/assistant-stats`).then(r => {
        if (!r.ok) throw new Error(`Assistant stats failed: ${r.status}`);
        return r.json();
      }),
      fetch(`${API_BASE}/dashboard/health`).then(r => {
        if (!r.ok) throw new Error(`Health check failed: ${r.status}`);
        return r.json();
      }),
      // Fetch last 30 days of revenue data
      fetch(`${API_BASE}/analytics/daily-revenue?from=${getDateDaysAgo(30)}&to=${getTodayDate()}`).then(r => {
        if (!r.ok) throw new Error(`Revenue data failed: ${r.status}`);
        return r.json();
      }).catch(err => {
        console.warn('Revenue data fetch failed:', err);
        return []; // Return empty array if fails
      })
    ]);

    return {
      business: {
        totalRevenue: business.totalRevenue || 0,
        totalOrders: business.totalOrders || 0,
        avgOrderValue: business.avgOrderValue || 0,
        ordersByStatus: business.ordersByStatus || []
      },
      performance: {
        avgLatency: performance.avgLatency || 0,
        activeSSEConnections: performance.activeSSEConnections || 0,
        failedRequests: performance.failedRequests || 0,
        llmAvgResponseTime: performance.llmAvgResponseTime,
        totalRequests: performance.totalRequests
      },
      assistant: {
        totalQueries: assistant.totalQueries || 0,
        intentDistribution: assistant.intentDistribution || [],
        functionFrequency: assistant.functionFrequency || [],
        avgResponseTimeByIntent: assistant.avgResponseTimeByIntent || []
      },
      health: {
        dbStatus: health.database?.status || health.dbStatus || 'Unknown',
        llmStatus: health.llm?.status || health.llmStatus || 'Unknown',
        lastUpdate: health.lastUpdate
      },
      revenue: revenue || []
    };
  } catch (error) {
    console.error('Failed to fetch dashboard metrics:', error);
    throw error;
  }
}

// ==================== ASSISTANT ====================

/**
 * Send a message to the assistant
 */
export async function sendAssistantMessage(
  message: string, 
  context?: any
): Promise<AssistantResponse> {
  return fetchJSON<AssistantResponse>(`${API_BASE}/assistant/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context: context || {} })
  });
}

/**
 * Check assistant health
 */
export async function getAssistantHealth(): Promise<{
  status: string;
  llm: {
    configured: boolean;
    enhancementEnabled: boolean;
  };
}> {
  return fetchJSON(`${API_BASE}/assistant/health`);
}

// ==================== SSE (Server-Sent Events) ====================

/**
 * Subscribe to real-time order status updates via SSE
 */
export function subscribeToOrderStatus(
  orderId: string,
  onUpdate: (data: {
    orderId: string;
    status: string;
    carrier?: string;
    estimatedDelivery?: string;
    updatedAt: string;
  }) => void,
  onError?: (error: any) => void
): () => void {
  const eventSource = new EventSource(`${API_BASE}/orders/${orderId}/stream`);

  eventSource.addEventListener('status', (event) => {
    try {
      const data = JSON.parse(event.data);
      onUpdate(data);
      
      // Close connection when order is delivered
      if (data.status === 'DELIVERED') {
        eventSource.close();
      }
    } catch (err) {
      console.error('Failed to parse SSE data:', err);
      if (onError) onError(err);
    }
  });

  eventSource.addEventListener('error', (event) => {
    try {
      const data = JSON.parse((event as any).data);
      if (onError) onError(data);
    } catch (err) {
      console.error('SSE error event:', err);
    }
  });

  eventSource.onerror = (err) => {
    console.error('EventSource error:', err);
    if (onError) onError(err);
    // EventSource will automatically attempt to reconnect
  };

  // Return cleanup function to close the connection
  return () => {
    console.log('Closing SSE connection for order:', orderId);
    eventSource.close();
  };
}

// ==================== EXPORTS ====================

export { API_BASE };

// Legacy/Mock function (kept for backwards compatibility)
export function getOrderStatus(orderId: string): {
  orderId: string;
  status: "Placed" | "Packed" | "Shipped" | "Delivered";
  carrier?: string;
  eta?: string;
} {
  const statuses = ["Placed", "Packed", "Shipped", "Delivered"] as const;
  const random = statuses[Math.floor(Math.random() * statuses.length)];
  const carrier = random !== "Placed" ? "FastShip" : undefined;
  const eta =
    random === "Delivered"
      ? "Arrived"
      : random === "Shipped"
      ? "2 days"
      : undefined;

  return { orderId, status: random, carrier, eta };
}