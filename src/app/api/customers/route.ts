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
    const customers =
      await prisma.customer.findMany({
        where: {
          workspaceId,
        },

        include: {
          subscriptions: {
            orderBy: {
              startedAt: "desc",
            },

            take: 1,

            include: {
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
      });

    return NextResponse.json(
      customers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        company: customer.company,
        createdAt: customer.createdAt,

        latestSubscription:
          customer.subscriptions[0] ?? null,
      }))
    );
  } catch (error) {
    console.error(
      "GET /api/customers failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to load customers.",
      },
      {
        status: 500,
      }
    );
  }
}