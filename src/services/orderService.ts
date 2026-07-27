import { orders as initialOrders } from "@/data/orders";
import { Order } from "@/types/order";
import { delay } from "@/utils/delay";

let ordersDatabase: Order[] = [...initialOrders];

export async function getOrders(): Promise<Order[]> {
  await delay(700);

  return [...ordersDatabase];
}

export async function updateOrderStatus(
  id: number,
  status: Order["status"]
): Promise<Order> {
  await delay(700);

  const existingOrder = ordersDatabase.find((order) => order.id === id);

  if (!existingOrder) {
    throw new Error("Order not found.");
  }

  const updatedOrder: Order = {
    ...existingOrder,
    status,
  };

  ordersDatabase = ordersDatabase.map((order) =>
    order.id === id ? updatedOrder : order
  );

  return updatedOrder;
}