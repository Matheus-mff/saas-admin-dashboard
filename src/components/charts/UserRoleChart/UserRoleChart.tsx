"use client";

import {
  Legend,
  Pie,
  PieChart,
  Tooltip,
} from "recharts";

import { ChartData } from "@/types/dashboard";

type UserRoleChartProps = {
  data: ChartData[];
};

const COLORS = [
  "#2563eb",
  "#7c3aed",
  "#16a34a",
];

export default function UserRoleChart({
  data,
}: UserRoleChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold">
        Users by Role
      </h2>

      <p className="mt-1 text-sm muted-text">
        Distribution of users by permission level.
      </p>

      <PieChart
        responsive
        style={{
          width: "100%",
          height: 300,
        }}
      >
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius="50%"
          outerRadius="75%"
          paddingAngle={4}
        />

        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}