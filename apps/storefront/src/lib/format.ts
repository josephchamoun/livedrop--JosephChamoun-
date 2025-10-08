

// 💰 Format currency values (e.g. 19.99 → "$19.99")
export function formatCurrency(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// 🪪 Mask an ID to show only last 4 characters (for PII rule)
export function maskId(id: string): string {
  return id.slice(-4).padStart(id.length, "*");
}
    
// Format delivery or ETA dates
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
