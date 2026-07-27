import { useEffect, useState } from "react";

import {
  getOrders,
  updateOrderStatus,
} from "@/services/orderService";

import { Order } from "@/types/order";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const data = await getOrders();

      setOrders(data);
    } catch {
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }

  async function changeOrderStatus(
    id: number,
    status: Order["status"]
  ) {
    const updatedOrder = await updateOrderStatus(
      id,
      status
    );

    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === id ? updatedOrder : order
      )
    );

    return updatedOrder;
  }

  useEffect(() => {
    let cancelled = false;

    getOrders()
      .then((data) => {
        if (cancelled) return;

        setOrders(data);
      })
      .catch(() => {
        if (cancelled) return;

        setError("Unable to load orders.");
      })
      .finally(() => {
        if (cancelled) return;

        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    orders,
    loading,
    error,
    retry: loadOrders,
    changeOrderStatus,
  };
}