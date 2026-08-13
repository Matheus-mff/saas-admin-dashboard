"use client";

import { BarChart } from "@/components/tremor/BarChart";

import { ChartData } from "@/types/dashboard";

type SubscriptionStatusChartProps = {
  data: ChartData[];
};

export default function SubscriptionStatusChart({
  data,
}: SubscriptionStatusChartProps) {
  const hasSubscriptions =
    data.some(
      (item) => item.value > 0
    );

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold">
        Subscription Status
      </h2>

      <p className="mt-1 text-sm muted-text">
        Current subscription lifecycle
        distribution.
      </p>

      {hasSubscriptions ? (
        <BarChart
          className="mt-6 h-[300px]"
          data={data}
          index="name"
          categories={["value"]}
          colors={["blue"]}
          showLegend={false}
          allowDecimals={false}
          yAxisWidth={35}
        />
      ) : (
        <div className="flex h-[300px] items-center justify-center text-center">
          <div>
            <p className="font-medium">
              No subscription data
            </p>

            <p className="mt-1 text-sm muted-text">
              Subscription statuses will
              appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}