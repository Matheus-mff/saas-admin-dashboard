import { Transaction } from "@/types/transaction";

import { getTransactionStatusClass } from "@/utils/getTransactionStatusClass";

type TransactionTableProps = {
  transactions: Transaction[];
};

export default function TransactionTable({
  transactions,
}: TransactionTableProps) {
  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] table-fixed">
          <thead className="table-header">
            <tr>
              <th className="w-[13%] px-6 py-3 text-left">
                Transaction
              </th>

              <th className="w-[25%] px-6 py-3 text-left">
                Customer
              </th>

              <th className="w-[17%] px-6 py-3 text-left">
                Plan
              </th>

              <th className="w-[15%] px-6 py-3 text-right">
                Amount
              </th>

              <th className="w-[15%] px-6 py-3 text-center">
                Status
              </th>

              <th className="w-[15%] px-6 py-3 text-left">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.map(
              (transaction) => (
                <tr
                  key={transaction.id}
                  className="table-row"
                >
                  <td className="px-6 py-4 font-medium">
                    #{transaction.id}
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium">
                      {
                        transaction
                          .subscription
                          .customer.name
                      }
                    </p>

                    <p className="mt-1 text-sm muted-text">
                      {transaction
                        .subscription
                        .customer
                        .company ?? "—"}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    {
                      transaction
                        .subscription
                        .plan.name
                    }
                  </td>

                  <td className="px-6 py-4 text-right font-medium tabular-nums">
                    $
                    {transaction.amount.toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits:
                          2,
                        maximumFractionDigits:
                          2,
                      }
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`status-badge ${getTransactionStatusClass(
                        transaction.status
                      )}`}
                    >
                      {
                        transaction.status
                      }
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {new Date(
                      transaction.createdAt
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
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}