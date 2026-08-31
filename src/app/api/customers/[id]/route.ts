import { NextResponse } from "next/server";
import { z } from "zod";

import { requireManagerOrAdmin } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

const customerSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters.").max(100, "Name is too long."),
  email: z.email({ error: "Please enter a valid email." }),
  company: z.union([z.string().max(100, "Company name is too long."), z.null()]).optional(),
});

type CustomerRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseCustomerId(id: string): number | null {
  const customerId = Number(id);

  if (!Number.isInteger(customerId) || customerId <= 0) {
    return null;
  }

  return customerId;
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function PATCH(request: Request, { params }: CustomerRouteContext) {
  const authResult = await requireManagerOrAdmin();

  if (authResult.response) {
    return authResult.response;
  }

  const workspaceId = authResult.session.user.workspaceId;

  try {
    const { id } = await params;
    const customerId = parseCustomerId(id);

    if (!customerId) {
      return NextResponse.json(
        {
          message: "Invalid customer ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existingCustomer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        workspaceId,
      },
      select: {
        id: true,
      },
    });

    if (!existingCustomer) {
      return NextResponse.json(
        {
          message: "Customer not found.",
        },
        {
          status: 404,
        }
      );
    }

    const body: unknown = await request.json();
    const parsedBody = customerSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: parsedBody.error.issues[0]?.message ?? "Invalid customer data.",
        },
        {
          status: 400,
        }
      );
    }

    const name = parsedBody.data.name;
    const email = parsedBody.data.email.trim().toLowerCase();
    const company =
      typeof parsedBody.data.company === "string" && parsedBody.data.company.trim()
        ? parsedBody.data.company.trim()
        : null;

    const customerWithSameEmail = await prisma.customer.findFirst({
      where: {
        workspaceId,
        email: {
          equals: email,
          mode: "insensitive",
        },
        NOT: {
          id: customerId,
        },
      },
      select: {
        id: true,
      },
    });

    if (customerWithSameEmail) {
      return NextResponse.json(
        {
          message: "A customer with this email already exists in this workspace.",
        },
        {
          status: 409,
        }
      );
    }

    const updatedCustomer = await prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        name,
        email,
        company,
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
    });

    return NextResponse.json({
      id: updatedCustomer.id,
      name: updatedCustomer.name,
      email: updatedCustomer.email,
      company: updatedCustomer.company,
      createdAt: updatedCustomer.createdAt,
      latestSubscription: updatedCustomer.subscriptions[0] ?? null,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        {
          message: "A customer with this email already exists in this workspace.",
        },
        {
          status: 409,
        }
      );
    }

    console.error("PATCH /api/customers/[id] failed:", error);

    return NextResponse.json(
      {
        message: "Unable to update customer.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(_request: Request, { params }: CustomerRouteContext) {
  const authResult = await requireManagerOrAdmin();

  if (authResult.response) {
    return authResult.response;
  }

  const workspaceId = authResult.session.user.workspaceId;

  try {
    const { id } = await params;
    const customerId = parseCustomerId(id);

    if (!customerId) {
      return NextResponse.json(
        {
          message: "Invalid customer ID.",
        },
        {
          status: 400,
        }
      );
    }

    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        workspaceId,
      },
      select: {
        id: true,
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        {
          message: "Customer not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (customer._count.subscriptions > 0) {
      return NextResponse.json(
        {
          message:
            "Customers with subscription history cannot be deleted. Keep this customer to preserve subscription and transaction history.",
        },
        {
          status: 409,
        }
      );
    }

    await prisma.customer.delete({
      where: {
        id: customerId,
      },
    });

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error("DELETE /api/customers/[id] failed:", error);

    return NextResponse.json(
      {
        message: "Unable to delete customer.",
      },
      {
        status: 500,
      }
    );
  }
}
