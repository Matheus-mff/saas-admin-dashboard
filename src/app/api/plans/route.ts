import { NextResponse } from "next/server";

import {
  requireAuthenticatedUser,
  requireManagerOrAdmin,
} from "@/lib/apiAuth";

import { prisma } from "@/lib/prisma";

type CreatePlanBody = {
  name?: unknown;
  monthlyPrice?: unknown;
};

function parsePrice(value: unknown): number | null {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return null;
  }

  return value;
}

export async function GET() {
  const authResult =
    await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  const workspaceId =
    authResult.session.user.workspaceId;

  try {
    const plans =
      await prisma.plan.findMany({
        where: {
          workspaceId,
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

        orderBy: {
          monthlyPrice: "asc",
        },
      });

    return NextResponse.json(
      plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        monthlyPrice: plan.monthlyPrice,
        activeSubscriptions:
          plan.subscriptions.length,
      }))
    );
  } catch (error) {
    console.error(
      "GET /api/plans failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Unable to load plans.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  const authResult =
    await requireManagerOrAdmin();

  if (authResult.response) {
    return authResult.response;
  }

  const workspaceId =
    authResult.session.user.workspaceId;

  try {
    const body =
      (await request.json()) as CreatePlanBody;

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const monthlyPrice =
      parsePrice(body.monthlyPrice);

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

    if (
      monthlyPrice === null ||
      monthlyPrice <= 0
    ) {
      return NextResponse.json(
        {
          message:
            "Monthly price must be greater than zero.",
        },
        {
          status: 400,
        }
      );
    }

    const existingPlan =
      await prisma.plan.findFirst({
        where: {
          workspaceId,

          name: {
            equals: name,
            mode: "insensitive",
          },
        },

        select: {
          id: true,
        },
      });

    if (existingPlan) {
      return NextResponse.json(
        {
          message:
            "A plan with this name already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const plan =
      await prisma.plan.create({
        data: {
          name,
          monthlyPrice,
          workspaceId,
        },
      });

    return NextResponse.json(
      {
        ...plan,
        activeSubscriptions: 0,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/plans failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Unable to create plan.",
      },
      {
        status: 500,
      }
    );
  }
}