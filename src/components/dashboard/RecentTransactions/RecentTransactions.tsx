import { Transaction } from "@/types/transaction";

import { getTransactionStatusClass } from "@/utils/getTransactionStatusClass";

type RecentTransactionsProps = {
  transactions: Transaction[];
};

export default function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {
  return (
    <div className="card">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">
          Recent Transactions
        </h2>

        <p className="mt-1 text-sm muted-text">
          Latest subscription payment
          activity.
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="flex min-h-52 items-center justify-center px-6 py-10 text-center">
          <div>
            <p className="font-medium">
              No transactions yet
            </p>

            <p className="mt-1 text-sm muted-text">
              Recent payments will
              appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] table-fixed">
            <thead className="table-header text-sm muted-text">
              <tr>
                <th className="w-[15%] px-6 py-3 text-left">
                  Transaction
                </th>

                <th className="w-[30%] px-6 py-3 text-left">
                  Customer
                </th>

                <th className="w-[20%] px-6 py-3 text-left">
                  Plan
                </th>

                <th className="w-[20%] px-6 py-3 text-right">
                  Amount
                </th>

                <th className="w-[15%] px-6 py-3 text-center">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(
                (transaction) => (
                  <tr
                    key={
                      transaction.id
                    }
                    className="table-row"
                  >
                    <td className="px-6 py-4 font-medium">
                      #
                      {
                        transaction.id
                      }
                    </td>

                    <td className="px-6 py-4">
                      {
                        transaction
                          .subscription
                          .customer.name
                      }
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
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}