"use client";

import { DonutChart } from "@/components/tremor/DonutChart";

import { ChartData } from "@/types/dashboard";

type SubscriptionsByPlanChartProps = {
  data: ChartData[];
};

export default function SubscriptionsByPlanChart({ data }: SubscriptionsByPlanChartProps) {
  const chartData = data.filter((item) => item.value > 0);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="card p-5 sm:p-6">
      <h2 className="section-title">Subscriptions by Plan</h2>

      <p className="mt-1 text-sm muted-text">Current distribution of active subscriptions.</p>

      {chartData.length > 0 ? (
        <div className="flex h-[300px] items-center justify-center">
          <DonutChart
            data={chartData}
            category="name"
            value="value"
            colors={["brand", "sky", "teal", "steel"]}
            showLabel
            label={`${total} active`}
            className="h-52 w-52"
          />
        </div>
      ) : (
        <div className="flex h-[300px] items-center justify-center text-center">
          <div>
            <p className="font-medium">No active subscriptions</p>

            <p className="mt-1 text-sm muted-text">Plan distribution will appear here.</p>
          </div>
        </div>
      )}
    </div>
  );
}
