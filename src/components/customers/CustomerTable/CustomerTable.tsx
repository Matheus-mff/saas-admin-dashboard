import { Customer } from "@/types/customer";

import { getSubscriptionStatusClass } from "@/utils/getSubscriptionStatusClass";

type CustomerTableProps = {
  customers: Customer[];
};

export default function CustomerTable({
  customers,
}: CustomerTableProps) {
  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] table-fixed">
          <thead className="table-header">
            <tr>
              <th className="w-[28%] px-6 py-3 text-left">
                Customer
              </th>

              <th className="w-[22%] px-6 py-3 text-left">
                Company
              </th>

              <th className="w-[18%] px-6 py-3 text-left">
                Plan
              </th>

              <th className="w-[16%] px-6 py-3 text-center">
                Status
              </th>

              <th className="w-[16%] px-6 py-3 text-left">
                Joined
              </th>
            </tr>
          </thead>

          <tbody>
            {customers.map(
              (customer) => {
                const subscription =
                  customer.latestSubscription;

                return (
                  <tr
                    key={customer.id}
                    className="table-row"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium">
                        {customer.name}
                      </p>

                      <p className="mt-1 truncate text-sm muted-text">
                        {customer.email}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      {customer.company ??
                        "—"}
                    </td>

                    <td className="px-6 py-4">
                      {subscription
                        ?.plan.name ?? "—"}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {subscription ? (
                        <span
                          className={`status-badge ${getSubscriptionStatusClass(
                            subscription.status
                          )}`}
                        >
                          {
                            subscription.status
                          }
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {new Date(
                        customer.createdAt
                      ).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}