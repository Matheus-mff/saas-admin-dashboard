import { NextResponse } from "next/server";

import {
  ORDER_STATUSES,
  OrderStatus,
} from "@/constants/orderStatuses";

import { requireAdmin } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

type UpdateOrderBody = {
  status?: unknown;
};

type OrderRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseOrderId(
  id: string
): number | null {
  const parsedId = Number(id);

  if (
    !Number.isInteger(parsedId) ||
    parsedId <= 0
  ) {
    return null;
  }

  return parsedId;
}

function isValidStatus(
  status: unknown
): status is OrderStatus {
  return (
    typeof status === "string" &&
    ORDER_STATUSES.some(
      (validStatus) =>
        validStatus === status
    )
  );
}

export async function PATCH(
  request: Request,
  { params }: OrderRouteContext
) {
  const authResult = await requireAdmin();

  if (authResult.response) {
    return authResult.response;
  }

  try {
    const { id } = await params;
    const orderId = parseOrderId(id);

    if (!orderId) {
      return NextResponse.json(
        {
          message: "Invalid order ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existingOrder =
      await prisma.order.findUnique({
        where: {
          id: orderId,
        },

        select: {
          id: true,
        },
      });

    if (!existingOrder) {
      return NextResponse.json(
        {
          message: "Order not found.",
        },
        {
          status: 404,
        }
      );
    }

    const body =
      (await request.json()) as UpdateOrderBody;

    if (!isValidStatus(body.status)) {
      return NextResponse.json(
        {
          message:
            "Please select a valid status.",
        },
        {
          status: 400,
        }
      );
    }

    const updatedOrder =
      await prisma.order.update({
        where: {
          id: orderId,
        },

        data: {
          status: body.status,
        },
      });

    return NextResponse.json(
      updatedOrder
    );
  } catch (error) {
    console.error(
      "PATCH /api/orders/[id] failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to update order status.",
      },
      {
        status: 500,
      }
    );
  }
}