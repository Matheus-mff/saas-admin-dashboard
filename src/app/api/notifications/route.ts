import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

import { Notification } from "@/types/notification";

const LOW_STOCK_LIMIT = 5;
const OLD_PENDING_ORDER_DAYS = 3;
const MAX_NOTIFICATIONS = 8;

export async function GET() {
  const authResult =
    await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  const workspaceId =
    authResult.session.user.workspaceId;

  try {
    const pendingOrderLimit = new Date(
      Date.now() -
      OLD_PENDING_ORDER_DAYS *
      24 *
      60 *
      60 *
      1000
    );

    const [
      outOfStockProducts,
      lowStockProducts,
      oldPendingOrders,
    ] = await Promise.all([
      prisma.product.findMany({
        where: {
          workspaceId,
          stock: 0,
        },

        select: {
          id: true,
          name: true,
        },

        orderBy: {
          updatedAt: "desc",
        },
      }),

      prisma.product.findMany({
        where: {
          workspaceId,

          stock: {
            gt: 0,
            lte: LOW_STOCK_LIMIT,
          },
        },

        select: {
          id: true,
          name: true,
          stock: true,
        },

        orderBy: {
          stock: "asc",
        },
      }),

      prisma.order.findMany({
        where: {
          workspaceId,
          status: "Pending",

          createdAt: {
            lt: pendingOrderLimit,
          },
        },

        select: {
          id: true,
          customer: true,
          createdAt: true,
        },

        orderBy: {
          createdAt: "asc",
        },
      }),
    ]);

    const outOfStockNotifications:
      Notification[] =
      outOfStockProducts.map(
        (product) => ({
          id: `out-of-stock-${product.id}`,
          type: "out-of-stock",
          title: "Product out of stock",
          message: `${product.name} has no units remaining.`,
          href: "/products",
        })
      );

    const lowStockNotifications:
      Notification[] =
      lowStockProducts.map(
        (product) => ({
          id: `low-stock-${product.id}`,
          type: "low-stock",
          title: "Low product stock",
          message: `${product.name} has only ${product.stock} ${product.stock === 1
            ? "unit"
            : "units"
            } remaining.`,
          href: "/products",
        })
      );

    const pendingOrderNotifications:
      Notification[] =
      oldPendingOrders.map(
        (order) => ({
          id: `pending-order-${order.id}`,
          type: "pending-order",
          title: "Pending order",
          message: `Order #${order.id} from ${order.customer} has been pending for more than ${OLD_PENDING_ORDER_DAYS} days.`,
          href: "/orders",
        })
      );

    const allNotifications = [
      ...outOfStockNotifications,
      ...lowStockNotifications,
      ...pendingOrderNotifications,
    ];

    return NextResponse.json({
      notifications:
        allNotifications.slice(
          0,
          MAX_NOTIFICATIONS
        ),

      total: allNotifications.length,
    });
  } catch (error) {
    console.error(
      "GET /api/notifications failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to load notifications.",
      },
      {
        status: 500,
      }
    );
  }
}