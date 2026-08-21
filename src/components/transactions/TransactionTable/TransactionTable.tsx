import SortableHeader from "@/components/ui/SortableHeader/SortableHeader";

import { SortDirection, TransactionSortField } from "@/types/sort";
import { Transaction } from "@/types/transaction";

import { getTransactionStatusClass } from "@/utils/getTransactionStatusClass";

type TransactionTableProps = {
  transactions: Transaction[];
  sortField: TransactionSortField;
  sortDirection: SortDirection;
  onSort: (field: TransactionSortField) => void;
};

export default function TransactionTable({
  transactions,
  sortField,
  sortDirection,
  onSort,
}: TransactionTableProps) {
  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] table-fixed">
          <thead className="table-header">
            <tr>
              <SortableHeader
                label="Transaction ID"
                field="id"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                className="w-[13%]"
              />

              <SortableHeader
                label="Customer"
                field="customer"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                className="w-[25%]"
              />

              <SortableHeader
                label="Plan"
                field="plan"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                className="w-[17%]"
              />

              <SortableHeader
                label="Amount"
                field="amount"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                align="right"
                className="w-[15%]"
              />

              <SortableHeader
                label="Status"
                field="status"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                align="center"
                className="w-[15%]"
              />

              <SortableHeader
                label="Date"
                field="date"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                className="w-[15%]"
              />
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="table-row">
                <td className="px-6 py-3.5 font-medium">#{transaction.id}</td>

                <td className="px-6 py-3.5">
                  <p
                    className="truncate font-medium"
                    title={transaction.subscription.customer.name}
                  >
                    {transaction.subscription.customer.name}
                  </p>

                  <p
                    className="mt-1 truncate text-sm muted-text"
                    title={transaction.subscription.customer.company ?? undefined}
                  >
                    {transaction.subscription.customer.company ?? "—"}
                  </p>
                </td>

                <td className="px-6 py-3.5">
                  <p className="truncate" title={transaction.subscription.plan.name}>
                    {transaction.subscription.plan.name}
                  </p>
                </td>

                <td className="px-6 py-3.5 text-right font-medium tabular-nums">
                  $
                  {transaction.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>

                <td className="px-6 py-3.5 text-center">
                  <span className={`status-badge ${getTransactionStatusClass(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </td>

                <td className="px-6 py-3.5">
                  {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
