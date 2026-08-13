"use client";

import { AreaChart } from "@/components/tremor/AreaChart";

import { SubscriptionGrowthPoint } from "@/types/dashboard";

type SubscriptionGrowthChartProps = {
  data: SubscriptionGrowthPoint[];
};

export default function SubscriptionGrowthChart({
  data,
}: SubscriptionGrowthChartProps) {
  const hasSubscriptions =
    data.some(
      (item) =>
        item.subscriptions > 0
    );

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold">
        Subscription Growth
      </h2>

      <p className="mt-1 text-sm muted-text">
        Subscription base at the end
        of each month.
      </p>

      {hasSubscriptions ? (
        <AreaChart
          className="mt-6 h-[300px]"
          data={data}
          index="month"
          categories={[
            "subscriptions",
          ]}
          colors={["blue"]}
          showLegend={false}
          allowDecimals={false}
          yAxisWidth={35}
        />
      ) : (
        <div className="flex h-[300px] items-center justify-center text-center">
          <div>
            <p className="font-medium">
              No subscription growth yet
            </p>

            <p className="mt-1 text-sm muted-text">
              Subscription growth will
              appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}