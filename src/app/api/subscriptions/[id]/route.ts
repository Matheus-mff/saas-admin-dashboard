import { NextResponse } from "next/server";

import { SUBSCRIPTION_STATUSES, SubscriptionStatus } from "@/constants/subscriptionStatuses";

import { requireManagerOrAdmin } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

type SubscriptionRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateSubscriptionBody = {
  status?: unknown;
};

function parseSubscriptionId(id: string): number | null {
  const subscriptionId = Number(id);

  if (!Number.isInteger(subscriptionId) || subscriptionId <= 0) {
    return null;
  }

  return subscriptionId;
}

function isSubscriptionStatus(value: unknown): value is SubscriptionStatus {
  return typeof value === "string" && SUBSCRIPTION_STATUSES.some((status) => status === value);
}

export async function PATCH(request: Request, { params }: SubscriptionRouteContext) {
  const authResult = await requireManagerOrAdmin();

  if (authResult.response) {
    return authResult.response;
  }

  const workspaceId = authResult.session.user.workspaceId;

  try {
    const { id } = await params;

    const subscriptionId = parseSubscriptionId(id);

    if (!subscriptionId) {
      return NextResponse.json(
        {
          message: "Invalid subscription ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        workspaceId,
      },

      select: {
        id: true,
      },
    });

    if (!existingSubscription) {
      return NextResponse.json(
        {
          message: "Subscription not found.",
        },
        {
          status: 404,
        }
      );
    }

    const body = (await request.json()) as UpdateSubscriptionBody;

    if (!isSubscriptionStatus(body.status)) {
      return NextResponse.json(
        {
          message: "Invalid subscription status.",
        },
        {
          status: 400,
        }
      );
    }

    const updatedSubscription = await prisma.subscription.update({
      where: {
        id: subscriptionId,
      },

      data: {
        status: body.status,

        canceledAt: body.status === "Canceled" ? new Date() : null,
      },

      include: {
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
    });

    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error("PATCH /api/subscriptions/[id] failed:", error);

    return NextResponse.json(
      {
        message: "Unable to update subscription.",
      },
      {
        status: 500,
      }
    );
  }
}
