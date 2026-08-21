import { NextResponse } from "next/server";

import { requireManagerOrAdmin } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

type PlanRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdatePlanBody = {
  name?: unknown;
  monthlyPrice?: unknown;
};

function parsePlanId(id: string): number | null {
  const planId = Number(id);

  if (!Number.isInteger(planId) || planId <= 0) {
    return null;
  }

  return planId;
}

function parsePrice(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return value;
}

export async function PATCH(request: Request, { params }: PlanRouteContext) {
  const authResult = await requireManagerOrAdmin();

  if (authResult.response) {
    return authResult.response;
  }

  const workspaceId = authResult.session.user.workspaceId;

  try {
    const { id } = await params;
    const planId = parsePlanId(id);

    if (!planId) {
      return NextResponse.json(
        {
          message: "Invalid plan ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existingPlan = await prisma.plan.findFirst({
      where: {
        id: planId,
        workspaceId,
      },

      select: {
        id: true,
      },
    });

    if (!existingPlan) {
      return NextResponse.json(
        {
          message: "Plan not found.",
        },
        {
          status: 404,
        }
      );
    }

    const body = (await request.json()) as UpdatePlanBody;

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const monthlyPrice = parsePrice(body.monthlyPrice);

    if (!name) {
      return NextResponse.json(
        {
          message: "Plan name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          message: "Plan name is too long.",
        },
        {
          status: 400,
        }
      );
    }

    if (monthlyPrice === null || monthlyPrice <= 0) {
      return NextResponse.json(
        {
          message: "Monthly price must be greater than zero.",
        },
        {
          status: 400,
        }
      );
    }

    const duplicatePlan = await prisma.plan.findFirst({
      where: {
        workspaceId,

        id: {
          not: planId,
        },

        name: {
          equals: name,
          mode: "insensitive",
        },
      },

      select: {
        id: true,
      },
    });

    if (duplicatePlan) {
      return NextResponse.json(
        {
          message: "A plan with this name already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const updatedPlan = await prisma.plan.update({
      where: {
        id: planId,
      },

      data: {
        name,
        monthlyPrice,
      },

      include: {
        subscriptions: {
          where: {
            status: "Active",
          },

          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: updatedPlan.id,
      name: updatedPlan.name,
      monthlyPrice: updatedPlan.monthlyPrice,
      activeSubscriptions: updatedPlan.subscriptions.length,
    });
  } catch (error) {
    console.error("PATCH /api/plans/[id] failed:", error);

    return NextResponse.json(
      {
        message: "Unable to update plan.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(_request: Request, { params }: PlanRouteContext) {
  const authResult = await requireManagerOrAdmin();

  if (authResult.response) {
    return authResult.response;
  }

  const workspaceId = authResult.session.user.workspaceId;

  try {
    const { id } = await params;
    const planId = parsePlanId(id);

    if (!planId) {
      return NextResponse.json(
        {
          message: "Invalid plan ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existingPlan = await prisma.plan.findFirst({
      where: {
        id: planId,
        workspaceId,
      },

      select: {
        id: true,
      },
    });

    if (!existingPlan) {
      return NextResponse.json(
        {
          message: "Plan not found.",
        },
        {
          status: 404,
        }
      );
    }

    const subscriptionCount = await prisma.subscription.count({
      where: {
        workspaceId,
        planId,
      },
    });

    if (subscriptionCount > 0) {
      return NextResponse.json(
        {
          message: "Plans with subscription history cannot be deleted.",
        },
        {
          status: 409,
        }
      );
    }

    await prisma.plan.delete({
      where: {
        id: planId,
      },
    });

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error("DELETE /api/plans/[id] failed:", error);

    return NextResponse.json(
      {
        message: "Unable to delete plan.",
      },
      {
        status: 500,
      }
    );
  }
}
