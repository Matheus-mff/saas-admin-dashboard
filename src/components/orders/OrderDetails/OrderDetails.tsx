"use client";

import { useState } from "react";

import {
  ORDER_STATUSES,
  OrderStatus,
} from "@/constants/orderStatuses";

import { Order } from "@/types/order";

type OrderDetailsProps = {
  order: Order;
  canManage: boolean;

  onStatusChange: (
    status: OrderStatus
  ) => void | Promise<void>;
};

export default function OrderDetails({
  order,
  canManage,
  onStatusChange,
}: OrderDetailsProps) {
  const [
    isUpdating,
    setIsUpdating,
  ] = useState(false);

  async function handleStatusChange(
    status: OrderStatus
  ) {
    if (!canManage) return;
    if (isUpdating) return;
    if (status === order.status) {
      return;
    }

    setIsUpdating(true);

    try {
      await onStatusChange(status);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
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
          $
          {order.total.toLocaleString()}
        </p>
      </div>

      <div>
        <p className="mb-1 text-sm muted-text">
          Status
        </p>

        {canManage ? (
          <>
            <label
              htmlFor="order-status"
              className="sr-only"
            >
              Order status
            </label>

            <select
              id="order-status"
              value={order.status}
              disabled={isUpdating}
              onChange={(event) =>
                handleStatusChange(
                  event.target
                    .value as OrderStatus
                )
              }
              className="form-control"
            >
              {ORDER_STATUSES.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}
            </select>

            {isUpdating && (
              <p
                className="mt-2 text-sm muted-text"
                aria-live="polite"
              >
                Updating status...
              </p>
            )}
          </>
        ) : (
          <p className="font-medium">
            {order.status}
          </p>
        )}
      </div>
    </div>
  );
}