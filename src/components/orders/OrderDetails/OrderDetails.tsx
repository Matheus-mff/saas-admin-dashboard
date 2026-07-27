"use client";

import { useState } from "react";

import {
  ORDER_STATUSES,
  OrderStatus,
} from "@/constants/orderStatuses";

import { Order } from "@/types/order";

type OrderDetailsProps = {
  order: Order;
  onStatusChange: (
    status: OrderStatus
  ) => void | Promise<void>;
};

export default function OrderDetails({
  order,
  onStatusChange,
}: OrderDetailsProps) {
  const [isUpdating, setIsUpdating] =
    useState(false);

  async function handleStatusChange(
    status: OrderStatus
  ) {
    if (isUpdating) return;
    if (status === order.status) return;

    setIsUpdating(true);

    try {
      await onStatusChange(status);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div>
      <div className="space-y-4">
        <div>
          <p className="text-sm muted-text">
            Order ID
          </p>

          <p className="font-medium">
            #{order.id}
          </p>
        </div>

        <div>
          <p className="text-sm muted-text">
            Customer
          </p>

          <p className="font-medium">
            {order.customer}
          </p>
        </div>

        <div>
          <p className="text-sm muted-text">
            Total
          </p>

          <p className="font-medium">
            ${order.total.toLocaleString()}
          </p>
        </div>

        <div>
          <label
            htmlFor="order-status"
            className="mb-1 block text-sm muted-text"
          >
            Status
          </label>

          <select
            id="order-status"
            value={order.status}
            disabled={isUpdating}
            onChange={(e) =>
              handleStatusChange(
                e.target.value as OrderStatus
              )
            }
            className="form-control"
          >
            {ORDER_STATUSES.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>

          {isUpdating && (
            <p
              className="mt-2 text-sm muted-text"
              aria-live="polite"
            >
              Updating status...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}