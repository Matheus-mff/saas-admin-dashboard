import { NextResponse } from "next/server";

import { ORDER_STATUSES } from "@/constants/orderStatuses";
import { USER_ROLES } from "@/constants/userRoles";

import { requireAuthenticatedUser } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const authResult =
    await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  const workspaceId =
    authResult.session.user.workspaceId;

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
      prisma.user.count({
        where: {
          workspaceId,
        },
      }),

      prisma.product.count({
        where: {
          workspaceId,
        },
      }),

      prisma.order.count({
        where: {
          workspaceId,
        },
      }),

      prisma.order.aggregate({
        where: {
          workspaceId,
        },

        _sum: {
          total: true,
        },
      }),

      prisma.user.groupBy({
        by: ["role"],

        where: {
          workspaceId,
        },

        _count: {
          role: true,
        },
      }),

      prisma.order.groupBy({
        by: ["status"],

        where: {
          workspaceId,
        },

        _count: {
          status: true,
        },
      }),

      prisma.order.findMany({
        where: {
          workspaceId,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 5,
      }),
    ]);

    const usersByRole =
      USER_ROLES.map((role) => {
        const roleGroup =
          userRoleGroups.find(
            (group) =>
              group.role === role
          );

        return {
          name: role,
          value:
            roleGroup?._count.role ?? 0,
        };
      });

    const ordersByStatus =
      ORDER_STATUSES.map((status) => {
        const statusGroup =
          orderStatusGroups.find(
            (group) =>
              group.status === status
          );

        return {
          name: status,
          value:
            statusGroup?._count.status ??
            0,
        };
      });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,

        totalRevenue:
          revenueResult._sum.total ?? 0,
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
        message:
          "Unable to load dashboard data.",
      },
      {
        status: 500,
      }
    );
  }
}