import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders failed:", error);

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