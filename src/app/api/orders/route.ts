import { NextResponse } from "next/server";

import {
  requireAuthenticatedUser,
} from "@/lib/apiAuth";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const authResult =
    await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  try {
    const orders =
      await prisma.order.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(orders);
  } catch (error) {
    console.error(
      "GET /api/orders failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Unable to load orders.",
      },
      {
        status: 500,
      }
    );
  }
}