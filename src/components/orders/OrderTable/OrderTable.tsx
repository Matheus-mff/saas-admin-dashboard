import { Eye } from "lucide-react";

import { Order } from "@/types/order";
import { getOrderStatusClass } from "@/utils/getOrderStatusClass";

type OrderTableProps = {
  orders: Order[];
  onView: (order: Order) => void;
};

export default function OrderTable({
  orders,
  onView,
}: OrderTableProps) {
  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="table-header">
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
                className="table-row"
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
                  <span
                    className={`status-badge ${getOrderStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => onView(order)}
                    className="icon-button"
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