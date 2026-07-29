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
  const chartData = data
    .filter((item) => item.value > 0)
    .map((item, index) => ({
      ...item,
      fill:
        COLORS[index % COLORS.length],
    }));

  const hasUsers =
    chartData.length > 0;

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold">
        Users by Role
      </h2>

      <p className="mt-1 text-sm muted-text">
        Distribution of users by permission level.
      </p>

      {hasUsers ? (
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
            paddingAngle={
              chartData.length > 1 ? 4 : 0
            }
          />

          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <div className="flex h-[300px] items-center justify-center text-center">
          <div>
            <p className="font-medium">
              No user data yet
            </p>

            <p className="mt-1 text-sm muted-text">
              Role distribution will appear here when
              users are added.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}