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

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function DashboardPage() {
  const { user } = useCurrentUser();

  const { data, loading, error, retry } = useDashboardStats();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
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

  const firstName = user.name.trim().split(/\s+/)[0] || "there";

  const activeCustomerShare =
    stats.totalCustomers > 0 ? Math.round((stats.activeCustomers / stats.totalCustomers) * 100) : 0;

  const annualRecurringRevenue = stats.mrr * 12;

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>

      <p className="page-description">
        Welcome back, {firstName}. Here is the latest activity across your workspace.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="MRR"
          value={formatCurrency(stats.mrr)}
          description={`${formatCurrency(annualRecurringRevenue)} annual recurring revenue`}
        />

        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          description={`${activeCustomerShare}% of customers have an active plan`}
        />

        <StatCard
          title="Customers"
          value={stats.totalCustomers}
          description={`${stats.newCustomersThisMonth} joined this month`}
        />

        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          description={`Across ${stats.paidTransactions} successful payments`}
        />
      </div>

      <div className="mt-5">
        <RevenueChart data={revenueOverTime} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <SubscriptionsByPlanChart data={subscriptionsByPlan} />

        <SubscriptionStatusChart data={subscriptionsByStatus} />
      </div>

      <div className="mt-5">
        <SubscriptionGrowthChart data={subscriptionGrowth} />
      </div>

      <div className="mt-5">
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
}
