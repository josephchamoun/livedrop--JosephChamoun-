// /src/lib/api.ts

// Define types
export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  tags: string[];
  stockQty: number;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  qty: number;
}

// Fetch list of products
export async function listProducts(): Promise<Product[]> {
  const res = await fetch("/mock-catalog.json");
  if (!res.ok) throw new Error("Failed to load catalog");
  return res.json();
}

// Get one product by ID
export async function getProduct(id: string): Promise<Product | undefined> {
  const products = await listProducts();
  return products.find((p) => p.id === id);
}

// Place an order and return a fake order ID
export function placeOrder(cart: CartItem[]): { orderId: string } {
  const orderId = Math.random().toString(36).substring(2, 12).toUpperCase();
  localStorage.setItem("lastOrder", JSON.stringify({ orderId, cart }));
  return { orderId };
}

// Get a fake order status
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
