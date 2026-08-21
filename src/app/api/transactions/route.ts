import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const authResult = await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  const workspaceId = authResult.session.user.workspaceId;

  try {
    const transactions = await prisma.transaction.findMany({
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
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("GET /api/transactions failed:", error);

    return NextResponse.json(
      {
        message: "Unable to load transactions.",
      },
      {
        status: 500,
      }
    );
  }
}
