"use client";

import { AreaChart } from "@/components/tremor/AreaChart";

import { RevenuePoint } from "@/types/dashboard";

type RevenueChartProps = {
  data: RevenuePoint[];
};

export default function RevenueChart({
  data,
}: RevenueChartProps) {
  const hasRevenue = data.some(
    (item) => item.revenue > 0
  );

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold">
        Revenue over Time
      </h2>

      <p className="mt-1 text-sm muted-text">
        Successful subscription
        payments over the last six
        months.
      </p>

      {hasRevenue ? (
        <AreaChart
          className="mt-6 h-[320px]"
          data={data}
          index="month"
          categories={["revenue"]}
          colors={["emerald"]}
          showLegend={false}
          yAxisWidth={90}
          valueFormatter={(value) =>
            `$${value.toLocaleString(
              "en-US",
              {
                minimumFractionDigits:
                  2,
                maximumFractionDigits:
                  2,
              }
            )}`
          }
        />
      ) : (
        <div className="flex h-[320px] items-center justify-center text-center">
          <div>
            <p className="font-medium">
              No revenue data yet
            </p>

            <p className="mt-1 text-sm muted-text">
              Successful subscription
              payments will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}