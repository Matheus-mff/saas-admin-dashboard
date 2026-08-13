import { NextResponse } from "next/server";

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
    const subscriptions =
      await prisma.subscription.findMany({
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

    return NextResponse.json(
      subscriptions
    );
  } catch (error) {
    console.error(
      "GET /api/subscriptions failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to load subscriptions.",
      },
      {
        status: 500,
      }
    );
  }
}