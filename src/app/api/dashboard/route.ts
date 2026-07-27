import { NextResponse } from "next/server";

import { ORDER_STATUSES } from "@/constants/orderStatuses";
import { USER_ROLES } from "@/constants/userRoles";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      revenueResult,
      userRoleGroups,
      orderStatusGroups,
      recentOrders,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.product.count(),

      prisma.order.count(),

      prisma.order.aggregate({
        _sum: {
          total: true,
        },
      }),

      prisma.user.groupBy({
        by: ["role"],

        _count: {
          role: true,
        },
      }),

      prisma.order.groupBy({
        by: ["status"],

        _count: {
          status: true,
        },
      }),

      prisma.order.findMany({
        orderBy: {
          createdAt: "desc",
        },

        take: 5,
      }),
    ]);

    const usersByRole = USER_ROLES.map((role) => {
      const roleGroup = userRoleGroups.find(
        (group) => group.role === role
      );

      return {
        name: role,
        value: roleGroup?._count.role ?? 0,
      };
    });

    const ordersByStatus = ORDER_STATUSES.map(
      (status) => {
        const statusGroup = orderStatusGroups.find(
          (group) => group.status === status
        );

        return {
          name: status,
          value: statusGroup?._count.status ?? 0,
        };
      }
    );

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: revenueResult._sum.total ?? 0,
      },

      usersByRole,
      ordersByStatus,
      recentOrders,
    });
  } catch (error) {
    console.error(
      "GET /api/dashboard failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Unable to load dashboard data.",
      },
      {
        status: 500,
      }
    );
  }
}