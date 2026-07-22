import { Order } from "@/types/order";

type OrderDetailsProps = {
  order: Order;
  onStatusChange: (status: Order["status"]) => void;
};

export default function OrderDetails({
  order,
  onStatusChange,
}: OrderDetailsProps) {
  return (
    <div>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">
            Order ID
          </p>

          <p className="font-medium">
            #{order.id}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Customer
          </p>

          <p className="font-medium">
            {order.customer}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Total
          </p>

          <p className="font-medium">
            ${order.total.toLocaleString()}
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-500">
            Status
          </label>

          <select
            value={order.status}
            onChange={(e) =>
              onStatusChange(
                e.target.value as Order["status"]
              )
            }
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="Pending">
              Pending
            </option>

            <option value="Processing">
              Processing
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}