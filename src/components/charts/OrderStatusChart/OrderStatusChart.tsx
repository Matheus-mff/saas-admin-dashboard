"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartData } from "@/types/dashboard";

type OrderStatusChartProps = {
  data: ChartData[];
};

export default function OrderStatusChart({
  data,
}: OrderStatusChartProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">
        Orders by Status
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Current distribution of all orders.
      </p>

      <BarChart
        data={data}
        responsive
        style={{
          width: "100%",
          height: 300,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
        />

        <XAxis
          dataKey="name"
          tickLine={false}
        />

        <YAxis
          allowDecimals={false}
          tickLine={false}
        />

        <Tooltip />

        <Bar
          dataKey="value"
          fill="#2563eb"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </div>
  );
}