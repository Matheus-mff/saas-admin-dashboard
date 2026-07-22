import { Eye } from "lucide-react";

import { Order } from "@/types/order";

type OrderTableProps = {
  orders: Order[];
  onView: (order: Order) => void;
};

export default function OrderTable({
  orders,
  onView,
}: OrderTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">
                Order
              </th>

              <th className="px-6 py-3 text-left">
                Customer
              </th>

              <th className="px-6 py-3 text-left">
                Total
              </th>

              <th className="px-6 py-3 text-left">
                Status
              </th>

              <th className="px-6 py-3 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  #{order.id}
                </td>

                <td className="px-6 py-4">
                  {order.customer}
                </td>

                <td className="px-6 py-4">
                  ${order.total.toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                    {order.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => onView(order)}
                    className="rounded-md p-2 transition hover:bg-gray-100"
                    aria-label="View order"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}