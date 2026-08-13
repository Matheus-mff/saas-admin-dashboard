import {
  SUBSCRIPTION_STATUSES,
  SubscriptionStatus,
} from "@/constants/subscriptionStatuses";

import { Subscription } from "@/types/subscription";

import { getSubscriptionStatusClass } from "@/utils/getSubscriptionStatusClass";

type SubscriptionTableProps = {
  subscriptions: Subscription[];
  canManage: boolean;

  onStatusChange: (
    id: number,
    status: SubscriptionStatus
  ) => void | Promise<void>;
};

export default function SubscriptionTable({
  subscriptions,
  canManage,
  onStatusChange,
}: SubscriptionTableProps) {
  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] table-fixed">
          <thead className="table-header">
            <tr>
              <th className="w-[28%] px-6 py-3 text-left">
                Customer
              </th>

              <th className="w-[18%] px-6 py-3 text-left">
                Plan
              </th>

              <th className="w-[18%] px-6 py-3 text-left">
                Price
              </th>

              <th className="w-[18%] px-6 py-3 text-left">
                Started
              </th>

              <th className="w-[18%] px-6 py-3 text-center">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {subscriptions.map(
              (subscription) => (
                <tr
                  key={
                    subscription.id
                  }
                  className="table-row"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium">
                      {
                        subscription
                          .customer.name
                      }
                    </p>

                    <p className="mt-1 text-sm muted-text">
                      {subscription
                        .customer
                        .company ?? "—"}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    {
                      subscription
                        .plan.name
                    }
                  </td>

                  <td className="px-6 py-4">
                    $
                    {subscription.plan.monthlyPrice.toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits:
                          2,
                        maximumFractionDigits:
                          2,
                      }
                    )}
                    /month
                  </td>

                  <td className="px-6 py-4">
                    {new Date(
                      subscription.startedAt
                    ).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {canManage ? (
                      <select
                        value={
                          subscription.status
                        }
                        onChange={(
                          event
                        ) => {
                          void onStatusChange(
                            subscription.id,
                            event.target
                              .value as SubscriptionStatus
                          );
                        }}
                        className={`form-control mx-auto max-w-36 text-center font-medium ${getSubscriptionStatusClass(
                          subscription.status
                        )}`}
                        aria-label={`Status for ${subscription.customer.name}`}
                      >
                        {SUBSCRIPTION_STATUSES.map(
                          (status) => (
                            <option
                              key={
                                status
                              }
                              value={
                                status
                              }
                            >
                              {
                                status
                              }
                            </option>
                          )
                        )}
                      </select>
                    ) : (
                      <span
                        className={`status-badge ${getSubscriptionStatusClass(
                          subscription.status
                        )}`}
                      >
                        {
                          subscription.status
                        }
                      </span>
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