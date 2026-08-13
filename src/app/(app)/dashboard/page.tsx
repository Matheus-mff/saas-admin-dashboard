"use client";

import RevenueChart from "@/components/charts/RevenueChart/RevenueChart";

import SubscriptionGrowthChart from "@/components/charts/SubscriptionGrowthChart/SubscriptionGrowthChart";

import SubscriptionsByPlanChart from "@/components/charts/SubscriptionsByPlanChart/SubscriptionsByPlanChart";

import SubscriptionStatusChart from "@/components/charts/SubscriptionStatusChart/SubscriptionStatusChart";

import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton/DashboardSkeleton";

import RecentTransactions from "@/components/dashboard/RecentTransactions/RecentTransactions";

import StatCard from "@/components/dashboard/StatCard/StatCard";

import ErrorState from "@/components/ui/ErrorState/ErrorState";

import { useCurrentUser } from "@/contexts/CurrentUserContext";

import { useDashboardStats } from "@/hooks/useDashboardStats";

function formatCurrency(
  value: number
) {
  return `$${value.toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

export default function DashboardPage() {
  const { user } =
    useCurrentUser();

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
    revenueOverTime,
    subscriptionsByPlan,
    subscriptionsByStatus,
    subscriptionGrowth,
    recentTransactions,
  } = data;

  const firstName =
    user.name
      .trim()
      .split(/\s+/)[0] ||
    "there";

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Welcome back, {firstName} 👋
      </h1>

      <p className="mt-2 muted-text">
        {
          "Here's what's happening in your workspace."
        }
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="MRR"
          value={formatCurrency(
            stats.mrr
          )}
        />

        <StatCard
          title="Active Subscriptions"
          value={
            stats.activeSubscriptions
          }
        />

        <StatCard
          title="Customers"
          value={
            stats.totalCustomers
          }
        />

        <StatCard
          title="Total Revenue"
          value={formatCurrency(
            stats.totalRevenue
          )}
        />
      </div>

      <div className="mt-8">
        <RevenueChart
          data={revenueOverTime}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SubscriptionsByPlanChart
          data={
            subscriptionsByPlan
          }
        />

        <SubscriptionStatusChart
          data={
            subscriptionsByStatus
          }
        />
      </div>

      <div className="mt-8">
        <SubscriptionGrowthChart
          data={
            subscriptionGrowth
          }
        />
      </div>

      <div className="mt-8">
        <RecentTransactions
          transactions={
            recentTransactions
          }
        />
      </div>
    </div>
  );
}