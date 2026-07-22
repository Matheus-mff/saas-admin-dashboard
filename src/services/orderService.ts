import { orders as initialOrders } from "@/data/orders";
import { Order } from "@/types/order";

let ordersDatabase: Order[] = [...initialOrders];

function simulateDelay() {
  return new Promise((resolve) => {
    setTimeout(resolve, 700);
  });
}

export async function getOrders(): Promise<Order[]> {
  await simulateDelay();

  return [...ordersDatabase];
}

export async function updateOrderStatus(
  id: number,
  status: Order["status"]
): Promise<Order> {
  await simulateDelay();

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