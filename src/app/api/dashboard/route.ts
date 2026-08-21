import { NextResponse } from "next/server";

import { SUBSCRIPTION_STATUSES } from "@/constants/subscriptionStatuses";

import { requireAuthenticatedUser } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

function getMonthStart(monthsAgo: number) {
  const now = new Date();

  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo, 1));
}

function getNextMonthStart() {
  const now = new Date();

  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
}

function getFollowingMonthStart(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
}

function getMonthKey(date: Date) {
  return `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
}

function getMonthLabel(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
}

export async function GET() {
  const authResult = await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  const workspaceId = authResult.session.user.workspaceId;

  try {
    const historyStart = getMonthStart(5);

    const historyEnd = getNextMonthStart();

    const [
      totalCustomers,
      newCustomersThisMonth,
      activeSubscriptions,
      activeCustomers,
      activeSubscriptionsForMrr,
      revenueResult,
      paidTransactions,
      plans,
      subscriptionStatusGroups,
      revenueTransactions,
      subscriptionHistory,
      recentTransactions,
    ] = await Promise.all([
      prisma.customer.count({
        where: {
          workspaceId,
        },
      }),

      prisma.customer.count({
        where: {
          workspaceId,
          createdAt: {
            gte: getMonthStart(0),
            lt: getNextMonthStart(),
          },
        },
      }),

      prisma.subscription.count({
        where: {
          workspaceId,
          status: "Active",
        },
      }),

      prisma.customer.count({
        where: {
          workspaceId,
          subscriptions: {
            some: {
              status: "Active",
            },
          },
        },
      }),

      prisma.subscription.findMany({
        where: {
          workspaceId,
          status: "Active",
        },

        select: {
          plan: {
            select: {
              monthlyPrice: true,
            },
          },
        },
      }),

      prisma.transaction.aggregate({
        where: {
          workspaceId,
          status: "Paid",
        },

        _sum: {
          amount: true,
        },
      }),

      prisma.transaction.count({
        where: {
          workspaceId,
          status: "Paid",
        },
      }),

      prisma.plan.findMany({
        where: {
          workspaceId,
        },

        select: {
          name: true,

          subscriptions: {
            where: {
              status: "Active",
            },

            select: {
              id: true,
            },
          },
        },

        orderBy: {
          monthlyPrice: "asc",
        },
      }),

      prisma.subscription.groupBy({
        by: ["status"],

        where: {
          workspaceId,
        },

        _count: {
          status: true,
        },
      }),

      prisma.transaction.findMany({
        where: {
          workspaceId,
          status: "Paid",

          paidAt: {
            gte: historyStart,
            lt: historyEnd,
          },
        },

        select: {
          amount: true,
          paidAt: true,
        },
      }),

      prisma.subscription.findMany({
        where: {
          workspaceId,

          startedAt: {
            lt: historyEnd,
          },
        },

        select: {
          startedAt: true,
          canceledAt: true,
        },
      }),

      prisma.transaction.findMany({
        where: {
          workspaceId,
        },

        include: {
          subscription: {
            select: {
              id: true,

              customer: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  company: true,
                },
              },

              plan: {
                select: {
                  id: true,
                  name: true,
                  monthlyPrice: true,
                },
              },
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 5,
      }),
    ]);

    const mrr = activeSubscriptionsForMrr.reduce(
      (total, subscription) => total + subscription.plan.monthlyPrice,
      0
    );

    const subscriptionsByPlan = plans.map((plan) => ({
      name: plan.name,
      value: plan.subscriptions.length,
    }));

    const subscriptionsByStatus = SUBSCRIPTION_STATUSES.map((status) => {
      const group = subscriptionStatusGroups.find((item) => item.status === status);

      return {
        name: status,
        value: group?._count.status ?? 0,
      };
    });

    const revenueByMonth = new Map<string, number>();

    const months = Array.from({ length: 6 }, (_, index) => getMonthStart(5 - index));

    months.forEach((month) => {
      revenueByMonth.set(getMonthKey(month), 0);
    });

    revenueTransactions.forEach((transaction) => {
      if (!transaction.paidAt) {
        return;
      }

      const key = getMonthKey(transaction.paidAt);

      revenueByMonth.set(key, (revenueByMonth.get(key) ?? 0) + transaction.amount);
    });

    const revenueOverTime = months.map((month) => ({
      month: getMonthLabel(month),

      revenue: revenueByMonth.get(getMonthKey(month)) ?? 0,
    }));

    /*
      Subscription Growth represents the size
      of the subscription base at the end of
      each month.

      A subscription counts if it had started
      before the following month and had not
      already been canceled.
    */
    const subscriptionGrowth = months.map((month) => {
      const monthEnd = getFollowingMonthStart(month);

      const subscriptions = subscriptionHistory.filter((subscription) => {
        const hadStarted = subscription.startedAt < monthEnd;

        const wasStillSubscribed = !subscription.canceledAt || subscription.canceledAt >= monthEnd;

        return hadStarted && wasStillSubscribed;
      }).length;

      return {
        month: getMonthLabel(month),

        subscriptions,
      };
    });

    return NextResponse.json({
      stats: {
        totalCustomers,
        newCustomersThisMonth,
        activeSubscriptions,
        activeCustomers,
        paidTransactions,
        mrr,

        totalRevenue: revenueResult._sum.amount ?? 0,
      },

      revenueOverTime,
      subscriptionsByPlan,
      subscriptionsByStatus,
      subscriptionGrowth,
      recentTransactions,
    });
  } catch (error) {
    console.error("GET /api/dashboard failed:", error);

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
