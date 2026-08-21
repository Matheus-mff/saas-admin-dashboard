import SubscriptionStatusMenu from "@/components/subscriptions/SubscriptionStatusMenu/SubscriptionStatusMenu";
import SortableHeader from "@/components/ui/SortableHeader/SortableHeader";

import { SubscriptionStatus } from "@/constants/subscriptionStatuses";

import { SortDirection, SubscriptionSortField } from "@/types/sort";
import { Subscription } from "@/types/subscription";

import { getSubscriptionStatusClass } from "@/utils/getSubscriptionStatusClass";

type SubscriptionTableProps = {
  subscriptions: Subscription[];
  sortField: SubscriptionSortField;
  sortDirection: SortDirection;
  canManage: boolean;
  onSort: (field: SubscriptionSortField) => void;
  onStatusChange: (id: number, status: SubscriptionStatus) => void | Promise<void>;
};

export default function SubscriptionTable({
  subscriptions,
  sortField,
  sortDirection,
  canManage,
  onSort,
  onStatusChange,
}: SubscriptionTableProps) {
  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] table-fixed">
          <thead className="table-header">
            <tr>
              <SortableHeader
                label="Customer"
                field="customer"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                className="w-[28%]"
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
                label="Price"
                field="price"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                className="w-[18%]"
              />

              <SortableHeader
                label="Started"
                field="started"
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
                className="w-[18%]"
              />
            </tr>
          </thead>

          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription.id} className="table-row">
                <td className="px-6 py-3.5">
                  <p className="truncate font-medium" title={subscription.customer.name}>
                    {subscription.customer.name}
                  </p>

                  <p
                    className="mt-1 truncate text-sm muted-text"
                    title={subscription.customer.company ?? undefined}
                  >
                    {subscription.customer.company ?? "—"}
                  </p>
                </td>

                <td className="px-6 py-3.5">
                  <p className="truncate" title={subscription.plan.name}>
                    {subscription.plan.name}
                  </p>
                </td>

                <td className="px-6 py-3.5 font-medium tabular-nums">
                  $
                  {subscription.plan.monthlyPrice.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  /month
                </td>

                <td className="px-6 py-3.5">
                  {new Date(subscription.startedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>

                <td className="px-6 py-3.5 text-center">
                  {canManage ? (
                    <SubscriptionStatusMenu
                      status={subscription.status}
                      customerName={subscription.customer.name}
                      onChange={(status) => onStatusChange(subscription.id, status)}
                    />
                  ) : (
                    <span
                      className={`status-badge ${getSubscriptionStatusClass(subscription.status)}`}
                    >
                      {subscription.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
