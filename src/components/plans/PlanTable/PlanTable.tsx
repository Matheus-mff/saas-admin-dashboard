import { Pencil } from "lucide-react";

import { Plan } from "@/types/plan";

type PlanTableProps = {
  plans: Plan[];
  canManage: boolean;
  onEdit: (plan: Plan) => void;
};

export default function PlanTable({
  plans,
  canManage,
  onEdit,
}: PlanTableProps) {
  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="table-header">
            <tr>
              <th
                className={`px-6 py-3 text-left ${canManage
                    ? "w-[35%]"
                    : "w-[40%]"
                  }`}
              >
                Plan
              </th>

              <th
                className={`px-6 py-3 text-left ${canManage
                    ? "w-[25%]"
                    : "w-[30%]"
                  }`}
              >
                Monthly Price
              </th>

              <th
                className={`px-6 py-3 text-center ${canManage
                    ? "w-[25%]"
                    : "w-[30%]"
                  }`}
              >
                Active Subscriptions
              </th>

              {canManage && (
                <th className="w-[15%] px-6 py-3 text-center">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {plans.map((plan) => (
              <tr
                key={plan.id}
                className="table-row"
              >
                <td className="px-6 py-4 font-medium">
                  {plan.name}
                </td>

                <td className="px-6 py-4">
                  $
                  {plan.monthlyPrice.toLocaleString(
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

                <td className="px-6 py-4 text-center font-medium tabular-nums">
                  {
                    plan.activeSubscriptions
                  }
                </td>

                {canManage && (
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(plan)
                        }
                        className="icon-button"
                        aria-label={`Edit ${plan.name}`}
                      >
                        <Pencil
                          size={18}
                        />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}