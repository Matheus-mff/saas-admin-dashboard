import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuthenticatedUser, requireManagerOrAdmin } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

const customerSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters.").max(100, "Name is too long."),
  email: z.email({ error: "Please enter a valid email." }),
  company: z.union([z.string().max(100, "Company name is too long."), z.null()]).optional(),
});

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function GET() {
  const authResult = await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  const workspaceId = authResult.session.user.workspaceId;

  try {
    const customers = await prisma.customer.findMany({
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
        latestSubscription: customer.subscriptions[0] ?? null,
      }))
    );
  } catch (error) {
    console.error("GET /api/customers failed:", error);

    return NextResponse.json(
      {
        message: "Unable to load customers.",
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

    const existingCustomer = await prisma.customer.findFirst({
      where: {
        workspaceId,
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
      },
    });

    if (existingCustomer) {
      return NextResponse.json(
        {
          message: "A customer with this email already exists in this workspace.",
        },
        {
          status: 409,
        }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        company,
        workspaceId,
      },
    });

    return NextResponse.json(
      {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        company: customer.company,
        createdAt: customer.createdAt,
        latestSubscription: null,
      },
      {
        status: 201,
      }
    );
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

    console.error("POST /api/customers failed:", error);

    return NextResponse.json(
      {
        message: "Unable to create customer.",
      },
      {
        status: 500,
      }
    );
  }
}
