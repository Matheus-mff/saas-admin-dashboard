import { NextResponse } from "next/server";

import { requireAuthenticatedUser, requireManagerOrAdmin } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

const CREATABLE_SUBSCRIPTION_STATUSES = ["Active", "Trialing"] as const;

type CreatableSubscriptionStatus = (typeof CREATABLE_SUBSCRIPTION_STATUSES)[number];

type CreateSubscriptionBody = {
  customerId?: unknown;
  planId?: unknown;
  status?: unknown;
};

function parsePositiveInteger(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    return null;
  }

  return value;
}

function isCreatableSubscriptionStatus(value: unknown): value is CreatableSubscriptionStatus {
  return (
    typeof value === "string" &&
    CREATABLE_SUBSCRIPTION_STATUSES.some((status) => status === value)
  );
}

export async function GET() {
  const authResult = await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  const workspaceId = authResult.session.user.workspaceId;

  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        workspaceId,
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
      orderBy: {
        startedAt: "desc",
      },
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("GET /api/subscriptions failed:", error);

    return NextResponse.json(
      {
        message: "Unable to load subscriptions.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  const authResult = await requireManagerOrAdmin();

  if (authResult.response) {
    return authResult.response;
  }

  const workspaceId = authResult.session.user.workspaceId;

  try {
    const body = (await request.json()) as CreateSubscriptionBody;

    const customerId = parsePositiveInteger(body.customerId);
    const planId = parsePositiveInteger(body.planId);

    if (!customerId) {
      return NextResponse.json(
        {
          message: "Please select a valid customer.",
        },
        {
          status: 400,
        }
      );
    }

    if (!planId) {
      return NextResponse.json(
        {
          message: "Please select a valid plan.",
        },
        {
          status: 400,
        }
      );
    }

    if (!isCreatableSubscriptionStatus(body.status)) {
      return NextResponse.json(
        {
          message: "Please select a valid starting status.",
        },
        {
          status: 400,
        }
      );
    }

    const [customer, plan, currentSubscription] = await Promise.all([
      prisma.customer.findFirst({
        where: {
          id: customerId,
          workspaceId,
        },
        select: {
          id: true,
        },
      }),
      prisma.plan.findFirst({
        where: {
          id: planId,
          workspaceId,
        },
        select: {
          id: true,
        },
      }),
      prisma.subscription.findFirst({
        where: {
          customerId,
          workspaceId,
          status: {
            in: ["Active", "Trialing"],
          },
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!customer) {
      return NextResponse.json(
        {
          message: "Customer not found in this workspace.",
        },
        {
          status: 404,
        }
      );
    }

    if (!plan) {
      return NextResponse.json(
        {
          message: "Plan not found in this workspace.",
        },
        {
          status: 404,
        }
      );
    }

    if (currentSubscription) {
      return NextResponse.json(
        {
          message:
            "This customer already has an Active or Trialing subscription. Cancel it before creating another subscription.",
        },
        {
          status: 409,
        }
      );
    }

    const subscription = await prisma.subscription.create({
      data: {
        customerId,
        planId,
        status: body.status,
        workspaceId,
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

    return NextResponse.json(subscription, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/subscriptions failed:", error);

    return NextResponse.json(
      {
        message: "Unable to create subscription.",
      },
      {
        status: 500,
      }
    );
  }
}
