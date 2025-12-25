import type { AdminOrderStatus } from "../../../api/user.api";

export const currency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(value);

export const statusConfig: Record<
  AdminOrderStatus | string,
  {
    label: string;
    color: "default" | "warning" | "success" | "primary" | "info" | "error";
  }
> = {
  PENDING: { label: "Pending", color: "warning" },
  PROCESSING: { label: "Processing", color: "primary" },
  PACKAGING: { label: "Packaging", color: "info" },
  IN_TRANSIT: { label: "In-Transit", color: "info" },
  FULFILLED: { label: "Fulfilled", color: "success" },
  // Tracking statuses
  NOTFOUND: { label: "Not Found", color: "error" },
  DISPATCHED: { label: "Dispatched", color: "info" },
  TRANSIT: { label: "In Transit", color: "info" },
  PICKUP: { label: "Ready for Pickup", color: "warning" },
  UNDELIVERED: { label: "Undelivered", color: "error" },
  DELIVERED: { label: "Delivered", color: "success" },
  EXCEPTION: { label: "Exception", color: "error" },
  EXPIRED: { label: "Expired", color: "error" },
};

export const statusFlow: AdminOrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "PACKAGING",
  "IN_TRANSIT",
  "FULFILLED",
];

export const getNextStatus = (
  currentStatus: AdminOrderStatus
): AdminOrderStatus | null => {
  const currentIndex = statusFlow.indexOf(currentStatus);
  if (currentIndex < statusFlow.length - 1) {
    return statusFlow[currentIndex + 1];
  }
  return null;
};

export const getPreviousStatus = (
  currentStatus: AdminOrderStatus
): AdminOrderStatus | null => {
  const currentIndex = statusFlow.indexOf(currentStatus);
  if (currentIndex > 0) {
    return statusFlow[currentIndex - 1];
  }
  return null;
};

// Normalize status from backend (handles old payment statuses and tracking statuses)
export const normalizeOrderStatus = (status: string): AdminOrderStatus | string => {
  const statusMap: Record<string, AdminOrderStatus | string> = {
    PAID: "PROCESSING",
    PENDING: "PENDING",
    CANCELLED: "PENDING",
    FAILED: "PENDING",
    REFUNDED: "PENDING",
    PROCESSING: "PROCESSING",
    PACKAGING: "PACKAGING",
    IN_TRANSIT: "IN_TRANSIT",
    FULFILLED: "FULFILLED",
    // Tracking statuses (keep as-is)
    NOTFOUND: "NOTFOUND",
    DISPATCHED: "DISPATCHED",
    TRANSIT: "TRANSIT",
    PICKUP: "PICKUP",
    UNDELIVERED: "UNDELIVERED",
    DELIVERED: "DELIVERED",
    EXCEPTION: "EXCEPTION",
    EXPIRED: "EXPIRED",
  };

  return statusMap[status] || status || "PENDING";
};

// Get status config safely
export const getStatusConfig = (status: string) => {
  const normalizedStatus = normalizeOrderStatus(status);
  return statusConfig[normalizedStatus] || statusConfig.PENDING;
};

