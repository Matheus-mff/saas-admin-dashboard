import { OrderStatus } from "@/constants/orderStatuses";

export function getOrderStatusClass(
  status: OrderStatus
): string {
  switch (status) {
    case "Completed":
      return "status-completed";

    case "Processing":
      return "status-processing";

    case "Pending":
      return "status-pending";
  }
}