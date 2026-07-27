import { Order } from "@/types/order";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export async function getOrders(): Promise<Order[]> {
  const response = await fetch("/api/orders", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Unable to load orders."
    );

    throw new Error(message);
  }

  return response.json();
}

export async function updateOrderStatus(
  id: number,
  status: Order["status"]
): Promise<Order> {
  const response = await fetch(`/api/orders/${id}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      status,
    }),
  });

  if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Unable to update order status."
    );

    throw new Error(message);
  }

  return response.json();
}