"use client";

import { useEffect, useState } from "react";

import OrderDetails from "@/components/orders/OrderDetails/OrderDetails";
import OrderTable from "@/components/orders/OrderTable/OrderTable";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import Modal from "@/components/ui/Modal/Modal";
import TableSkeleton from "@/components/ui/Skeleton/TableSkeleton";
import Toast from "@/components/ui/Toast/Toast";

import { useOrders } from "@/hooks/useOrders";
import { Order } from "@/types/order";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const {
    orders,
    loading,
    error,
    retry,
    changeOrderStatus,
  } = useOrders();

  const filteredOrders = orders.filter((order) => {
    const term = search.toLowerCase();

    const matchesSearch =
      order.customer.toLowerCase().includes(term) ||
      order.id.toString().includes(term);

    const matchesStatus =
      statusFilter === "All" ||
      order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    if (!toastMessage) return;

    const timeout = setTimeout(() => {
      setToastMessage("");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [toastMessage]);

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

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Orders
      </h1>

      <p className="mt-2 text-gray-500">
        View and manage customer orders.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            "All",
            "Pending",
            "Processing",
            "Completed",
          ].map((status) => (
            <button
              key={status}
              onClick={() =>
                setStatusFilter(status)
              }
              className={`rounded-lg px-4 py-2 ${
                statusFilter === status
                  ? "bg-blue-600 text-white"
                  : "border"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search by customer or order ID..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-lg border px-4 py-2"
        />
      </div>

      <div className="mt-6">
        {filteredOrders.length === 0 ? (
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
        open={!!selectedOrder}
        title="Order Details"
        onClose={() =>
          setSelectedOrder(undefined)
        }
      >
        {selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            onStatusChange={async (status) => {
              try {
                const updatedOrder =
                  await changeOrderStatus(
                    selectedOrder.id,
                    status
                  );

                setSelectedOrder(
                  updatedOrder
                );

                setToastType("success");

                setToastMessage(
                  "Order status updated successfully."
                );
              } catch {
                setToastType("error");

                setToastMessage(
                  "Unable to update order status."
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