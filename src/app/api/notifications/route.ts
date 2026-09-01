import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/apiAuth";

import { prisma } from "@/lib/prisma";

import { Notification } from "@/types/notification";

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export async function GET() {
  const authResult = await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  const workspaceId = authResult.session.user.workspaceId;

  try {
    const [failedTransactions, pendingTransactions, trialSubscriptions] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          workspaceId,
          status: "Failed",
        },

        select: {
          id: true,
          amount: true,

          subscription: {
            select: {
              customer: {
                select: {
                  name: true,
                },
              },

              plan: {
                select: {
                  name: true,
                },
              },
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.transaction.findMany({
        where: {
          workspaceId,
          status: "Pending",
        },

        select: {
          id: true,
          amount: true,

          subscription: {
            select: {
              customer: {
                select: {
                  name: true,
                },
              },

              plan: {
                select: {
                  name: true,
                },
              },
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.subscription.findMany({
        where: {
          workspaceId,
          status: "Trialing",
        },

        select: {
          id: true,

          customer: {
            select: {
              name: true,
            },
          },

          plan: {
            select: {
              name: true,
            },
          },
        },

        orderBy: {
          startedAt: "desc",
        },
      }),
    ]);

    const failedPaymentNotifications: Notification[] = failedTransactions.map((transaction) => ({
      id: `failed-payment-${transaction.id}`,

      type: "failed-payment",

      title: "Payment failed",

      message: `${formatCurrency(transaction.amount)} payment from ${
        transaction.subscription.customer.name
      } for the ${transaction.subscription.plan.name} plan failed.`,

      href: "/transactions",
    }));

    const pendingPaymentNotifications: Notification[] = pendingTransactions.map((transaction) => ({
      id: `pending-payment-${transaction.id}`,

      type: "pending-payment",

      title: "Payment pending",

      message: `${formatCurrency(transaction.amount)} payment from ${
        transaction.subscription.customer.name
      } for the ${transaction.subscription.plan.name} plan is pending.`,

      href: "/transactions",
    }));

    const trialNotifications: Notification[] = trialSubscriptions.map((subscription) => ({
      id: `trial-subscription-${subscription.id}`,

      type: "trial-subscription",

      title: "Trial subscription",

      message: `${subscription.customer.name} is currently trialing the ${
        subscription.plan.name
      } plan.`,

      href: "/subscriptions",
    }));

    const allNotifications = [
      ...failedPaymentNotifications,
      ...pendingPaymentNotifications,
      ...trialNotifications,
    ];

    return NextResponse.json({
      notifications: allNotifications,

      total: allNotifications.length,
    });
  } catch (error) {
    console.error("GET /api/notifications failed:", error);

    return NextResponse.json(
      {
        message: "Unable to load notifications.",
      },
      {
        status: 500,
      }
    );
  }
}
