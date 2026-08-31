import { Pencil, Trash2 } from "lucide-react";

import RowActionsMenu from "@/components/ui/RowActionsMenu/RowActionsMenu";
import SortableHeader from "@/components/ui/SortableHeader/SortableHeader";

import { Customer } from "@/types/customer";

import { CustomerSortField, SortDirection } from "@/types/sort";

import { getSubscriptionStatusClass } from "@/utils/getSubscriptionStatusClass";

type CustomerTableProps = {
  customers: Customer[];
  sortField: CustomerSortField;
  sortDirection: SortDirection;
  canManage: boolean;

  onSort: (field: CustomerSortField) => void;

  onEdit: (customer: Customer) => void;

  onDelete: (customer: Customer) => void;
};

export default function CustomerTable({
  customers,
  sortField,
  sortDirection,
  canManage,
  onSort,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className={`w-full table-fixed ${canManage ? "min-w-[1000px]" : "min-w-[900px]"}`}>
          <thead className="table-header">
            <tr>
              <SortableHeader
                label="Customer"
                field="name"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                className={canManage ? "w-[26%]" : "w-[28%]"}
              />

              <SortableHeader
                label="Company"
                field="company"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                className={canManage ? "w-[19%]" : "w-[22%]"}
              />

              <SortableHeader
                label="Plan"
                field="plan"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                className={canManage ? "w-[17%]" : "w-[18%]"}
              />

              <SortableHeader
                label="Status"
                field="status"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                align="center"
                className={canManage ? "w-[14%]" : "w-[16%]"}
              />

              <SortableHeader
                label="Joined"
                field="joined"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                className={canManage ? "w-[16%]" : "w-[16%]"}
              />

              {canManage && <th className="w-[8%] px-4 py-3 text-center">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => {
              const subscription = customer.latestSubscription;

              const hasSubscriptionHistory = Boolean(subscription);

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

                  {canManage && (
                    <td className="px-4 py-3.5">
                      <div className="flex justify-center">
                        <RowActionsMenu
                          label={`Actions for ${customer.name}`}
                          actions={[
                            {
                              label: "Edit customer",
                              icon: Pencil,

                              onClick: () => onEdit(customer),
                            },

                            {
                              label: "Delete customer",

                              icon: Trash2,

                              tone: "danger",

                              disabled: hasSubscriptionHistory,

                              title: hasSubscriptionHistory
                                ? "Customers with subscription history cannot be deleted."
                                : undefined,

                              onClick: () => onDelete(customer),
                            },
                          ]}
                        />
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
