import { Order } from "@/types/order";

type RecentOrdersProps = {
  orders: Order[];
};

export default function RecentOrders({
  orders,
}: RecentOrdersProps) {
  return (
    <div className="card">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">
          Recent Orders
        </h2>

        <p className="mt-1 text-sm muted-text">
          Latest customer purchases.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="table-header text-left text-sm muted-text">
            <tr>
              <th className="px-6 py-3">
                Order
              </th>

              <th className="px-6 py-3">
                Customer
              </th>

              <th className="px-6 py-3">
                Total
              </th>

              <th className="px-6 py-3">
                Status
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
                    className={`status-badge ${order.status === "Completed"
                        ? "status-completed"
                        : order.status === "Processing"
                          ? "status-processing"
                          : "status-pending"
                      }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}