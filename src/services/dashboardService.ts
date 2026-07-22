import { orders } from "@/data/orders";
import { products } from "@/data/products";
import { getUsers } from "@/services/userService";
import { DashboardData } from "@/types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  const users = await getUsers();

  const totalRevenue = orders.reduce(
    (total, order) => total + order.total,
    0
  );

  const usersByRole = [
    {
      name: "Admin",
      value: users.filter(
        (user) => user.role === "Admin"
      ).length,
    },
    {
      name: "Manager",
      value: users.filter(
        (user) => user.role === "Manager"
      ).length,
    },
    {
      name: "User",
      value: users.filter(
        (user) => user.role === "User"
      ).length,
    },
  ];

  const ordersByStatus = [
    {
      name: "Pending",
      value: orders.filter(
        (order) => order.status === "Pending"
      ).length,
    },
    {
      name: "Processing",
      value: orders.filter(
        (order) => order.status === "Processing"
      ).length,
    },
    {
      name: "Completed",
      value: orders.filter(
        (order) => order.status === "Completed"
      ).length,
    },
  ];

  return {
    stats: {
      totalUsers: users.length,
      totalOrders: orders.length,
      totalRevenue,
      totalProducts: products.length,
    },

    usersByRole,
    ordersByStatus,

    recentOrders: orders.slice(0, 5),
  };
}