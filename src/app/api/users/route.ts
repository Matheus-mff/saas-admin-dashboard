import { NextResponse } from "next/server";

import {
  USER_ROLES,
  UserRole,
} from "@/constants/userRoles";

import {
  requireAdmin,
  requireAuthenticatedUser,
} from "@/lib/apiAuth";

import { prisma } from "@/lib/prisma";

type CreateUserBody = {
  name?: unknown;
  email?: unknown;
  role?: unknown;
};

function isValidRole(role: unknown): role is UserRole {
  return (
    typeof role === "string" &&
    USER_ROLES.some(
      (validRole) => validRole === role
    )
  );
}

export async function GET() {
  const authResult =
    await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/users failed:", error);

    return NextResponse.json(
      {
        message: "Unable to load users.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  const authResult = await requireAdmin();

  if (authResult.response) {
    return authResult.response;
  }

  try {
    const body =
      (await request.json()) as CreateUserBody;

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const role = body.role;

    if (!name) {
      return NextResponse.json(
        {
          message: "Name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          message: "Email is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        {
          message: "Please enter a valid email.",
        },
        {
          status: 400,
        }
      );
    }

    if (!isValidRole(role)) {
      return NextResponse.json(
        {
          message: "Please select a valid role.",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },

        select: {
          id: true,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          message:
            "A user with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(newUser, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "POST /api/users failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Unable to create user.",
      },
      {
        status: 500,
      }
    );
  }
}