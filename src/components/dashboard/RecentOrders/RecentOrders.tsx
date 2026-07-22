import { Order } from "@/types/order";

type RecentOrdersProps = {
  orders: Order[];
};

export default function RecentOrders({
  orders,
}: RecentOrdersProps) {
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">
          Recent Orders
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Latest customer purchases.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-sm text-gray-500">
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
                className="border-t"
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}