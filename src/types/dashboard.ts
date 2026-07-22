import { Order } from "@/types/order";

export type DashboardStats = {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
};

export type ChartData = {
  name: string;
  value: number;
};

export type DashboardData = {
  stats: DashboardStats;
  usersByRole: ChartData[];
  ordersByStatus: ChartData[];
  recentOrders: Order[];
};