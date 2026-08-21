import SortableHeader from "@/components/ui/SortableHeader/SortableHeader";

import { Customer } from "@/types/customer";
import { CustomerSortField, SortDirection } from "@/types/sort";

import { getSubscriptionStatusClass } from "@/utils/getSubscriptionStatusClass";

type CustomerTableProps = {
  customers: Customer[];
  sortField: CustomerSortField;
  sortDirection: SortDirection;
  onSort: (field: CustomerSortField) => void;
};

export default function CustomerTable({
  customers,
  sortField,
  sortDirection,
  onSort,
}: CustomerTableProps) {
  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] table-fixed">
          <thead className="table-header">
            <tr>
              <SortableHeader
                label="Customer"
                field="name"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                className="w-[28%]"
              />

              <SortableHeader
                label="Company"
                field="company"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                className="w-[22%]"
              />

              <SortableHeader
                label="Plan"
                field="plan"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                className="w-[18%]"
              />

              <SortableHeader
                label="Status"
                field="status"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                align="center"
                className="w-[16%]"
              />

              <SortableHeader
                label="Joined"
                field="joined"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                className="w-[16%]"
              />
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => {
              const subscription = customer.latestSubscription;

              return (
                <tr key={customer.id} className="table-row">
                  <td className="px-6 py-3.5">
                    <p className="truncate font-medium" title={customer.name}>
                      {customer.name}
                    </p>

                    <p className="mt-1 truncate text-sm muted-text" title={customer.email}>
                      {customer.email}
                    </p>
                  </td>

                  <td className="px-6 py-3.5">
                    <p className="truncate" title={customer.company ?? undefined}>
                      {customer.company ?? "—"}
                    </p>
                  </td>

                  <td className="px-6 py-3.5">
                    <p className="truncate" title={subscription?.plan.name}>
                      {subscription?.plan.name ?? "—"}
                    </p>
                  </td>

                  <td className="px-6 py-3.5 text-center">
                    {subscription ? (
                      <span
                        className={`status-badge ${getSubscriptionStatusClass(
                          subscription.status
                        )}`}
                      >
                        {subscription.status}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="px-6 py-3.5">
                    {new Date(customer.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
