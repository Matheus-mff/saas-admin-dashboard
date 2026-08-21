import { Transaction } from "@/types/transaction";

export type DashboardStats = {
  totalCustomers: number;
  newCustomersThisMonth: number;
  activeSubscriptions: number;
  activeCustomers: number;
  paidTransactions: number;
  mrr: number;
  totalRevenue: number;
};

export type ChartData = {
  name: string;
  value: number;
};

export type RevenuePoint = {
  month: string;
  revenue: number;
};

export type SubscriptionGrowthPoint = {
  month: string;
  subscriptions: number;
};

export type DashboardData = {
  stats: DashboardStats;
  revenueOverTime: RevenuePoint[];
  subscriptionsByPlan: ChartData[];
  subscriptionsByStatus: ChartData[];
  subscriptionGrowth: SubscriptionGrowthPoint[];
  recentTransactions: Transaction[];
};
