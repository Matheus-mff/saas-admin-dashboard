import { OrderStatus } from "@/constants/orderStatuses";

import { Order } from "@/types/order";

import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { notifyDashboardDataChanged } from "@/utils/dashboardEvents";

export async function getOrders(): Promise<Order[]> {
  const response = await fetch("/api/orders");

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        "Unable to load orders."
      )
    );
  }

  return response.json();
}

export async function updateOrderStatus(
  id: number,
  status: OrderStatus
): Promise<Order> {
  const response = await fetch(
    `/api/orders/${id}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        status,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        "Unable to update order status."
      )
    );
  }

  const updatedOrder: Order =
    await response.json();

  notifyDashboardDataChanged();

  return updatedOrder;
}