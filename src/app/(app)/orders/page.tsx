"use client";

import { useState } from "react";

import OrderDetails from "@/components/orders/OrderDetails/OrderDetails";
import OrderTable from "@/components/orders/OrderTable/OrderTable";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import Modal from "@/components/ui/Modal/Modal";
import TableSkeleton from "@/components/ui/Skeleton/TableSkeleton";
import Toast from "@/components/ui/Toast/Toast";

import {
  ORDER_STATUS_FILTERS,
  OrderStatusFilter,
} from "@/constants/orderStatuses";

import { useCurrentUser } from "@/contexts/CurrentUserContext";

import { useOrders } from "@/hooks/useOrders";
import { useToast } from "@/hooks/useToast";

import { Order } from "@/types/order";

export default function OrdersPage() {
  const { canManageOperations } =
    useCurrentUser();

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<OrderStatusFilter>("All");

  const [
    selectedOrder,
    setSelectedOrder,
  ] = useState<Order | undefined>();

  const {
    toastMessage,
    toastType,
    showToast,
  } = useToast();

  const {
    orders,
    loading,
    error,
    retry,
    changeOrderStatus,
  } = useOrders();

  const normalizedSearch = search
    .trim()
    .toLowerCase();

  const filteredOrders =
    orders.filter((order) => {
      const matchesSearch =
        order.customer
          .toLowerCase()
          .includes(normalizedSearch) ||
        order.id
          .toString()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={retry}
      />
    );
  }

  const hasOrders =
    orders.length > 0;

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Orders
      </h1>

      <p className="mt-2 muted-text">
        {canManageOperations
          ? "View and manage customer orders."
          : "View customer orders in your workspace."}
      </p>

      {hasOrders && (
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {ORDER_STATUS_FILTERS.map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setStatusFilter(
                      status
                    )
                  }
                  className={
                    statusFilter ===
                      status
                      ? "primary-button"
                      : "secondary-button"
                  }
                >
                  {status}
                </button>
              )
            )}
          </div>

          <input
            type="search"
            placeholder="Search by customer or order ID..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            className="form-control"
          />
        </div>
      )}

      <div className="mt-6">
        {orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Orders will appear here when customers place them."
          />
        ) : filteredOrders.length ===
          0 ? (
          <EmptyState
            title="No orders found"
            description="Try another search or filter."
          />
        ) : (
          <OrderTable
            orders={filteredOrders}
            onView={(order) => {
              setSelectedOrder(order);
            }}
          />
        )}
      </div>

      <Modal
        open={Boolean(selectedOrder)}
        title="Order Details"
        onClose={() =>
          setSelectedOrder(undefined)
        }
      >
        {selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            canManage={
              canManageOperations
            }
            onStatusChange={async (
              status
            ) => {
              try {
                const updatedOrder =
                  await changeOrderStatus(
                    selectedOrder.id,
                    status
                  );

                setSelectedOrder(
                  updatedOrder
                );

                showToast(
                  "Order status updated successfully."
                );
              } catch (error) {
                const message =
                  error instanceof Error
                    ? error.message
                    : "Unable to update order status.";

                showToast(
                  message,
                  "error"
                );
              }
            }}
          />
        )}
      </Modal>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
        />
      )}
    </div>
  );
}