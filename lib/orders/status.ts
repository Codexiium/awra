// Single source of truth for order status values, display labels, and
// styling — consumed by both the admin orders UI and the customer-facing
// account pages so the six statuses render consistently everywhere.
export const ORDER_STATUSES = ["pending", "accepted", "processing", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "PENDING",
  accepted: "ACCEPTED",
  processing: "PROCESSING",
  shipped: "SHIPPED",
  delivered: "DELIVERED",
  cancelled: "CANCELLED"
};

// text-only color, for compact inline use (e.g. the account overview list)
const STATUS_TEXT_CLASSES: Record<OrderStatus, string> = {
  pending: "text-zinc-400",
  accepted: "text-sky-400",
  processing: "text-amber-400",
  shipped: "text-violet-400",
  delivered: "text-emerald-400",
  cancelled: "text-red-400"
};

// bordered bg+text pill, for the order history / detail pages and admin
const STATUS_PILL_CLASSES: Record<OrderStatus, string> = {
  pending: "bg-zinc-900/80 border-zinc-500/40 text-zinc-300",
  accepted: "bg-sky-950/80 border-sky-500/40 text-sky-300",
  processing: "bg-amber-950/80 border-amber-500/40 text-amber-300",
  shipped: "bg-violet-950/80 border-violet-500/40 text-violet-300",
  delivered: "bg-emerald-950/80 border-emerald-500/40 text-emerald-300",
  cancelled: "bg-red-950/80 border-red-500/40 text-red-300"
};

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export function orderStatusLabel(status: string): string {
  return isOrderStatus(status) ? STATUS_LABELS[status] : status.toUpperCase();
}

export function orderStatusTextClass(status: string): string {
  return isOrderStatus(status) ? STATUS_TEXT_CLASSES[status] : STATUS_TEXT_CLASSES.pending;
}

export function orderStatusPillClass(status: string): string {
  const color = isOrderStatus(status) ? STATUS_PILL_CLASSES[status] : STATUS_PILL_CLASSES.pending;
  return `px-2.5 py-1 border text-[10px] uppercase font-bold ${color}`;
}
