"use client";

import OrderStatusChart from "@/components/charts/OrderStatusChart/OrderStatusChart";
import UserRoleChart from "@/components/charts/UserRoleChart/UserRoleChart";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton/DashboardSkeleton";
import RecentOrders from "@/components/dashboard/RecentOrders/RecentOrders";
import StatCard from "@/components/dashboard/StatCard/StatCard";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function DashboardPage() {
  const {
    data,
    loading,
    error,
    retry,
  } = useDashboardStats();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={retry}
      />
    );
  }

  if (!data) {
    return null;
  }

  const {
    stats,
    usersByRole,
    ordersByStatus,
    recentOrders,
  } = data;

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Welcome back, Matheus 👋
      </h1>

      <p className="mt-2 text-gray-500">
        Here's what's happening today.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Users"
          value={stats.totalUsers}
        />

        <StatCard
          title="Orders"
          value={stats.totalOrders}
        />

        <StatCard
          title="Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
        />

        <StatCard
          title="Products"
          value={stats.totalProducts}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <UserRoleChart
          data={usersByRole}
        />

        <OrderStatusChart
          data={ordersByStatus}
        />
      </div>

      <div className="mt-8">
        <RecentOrders
          orders={recentOrders}
        />
      </div>
    </div>
  );
}