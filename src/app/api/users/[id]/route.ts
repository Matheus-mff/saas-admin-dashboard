import { NextResponse } from "next/server";

import {
  USER_ROLES,
  UserRole,
} from "@/constants/userRoles";

import { requireAdmin } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

type UpdateUserBody = {
  name?: unknown;
  email?: unknown;
  role?: unknown;
};

type UserRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function isValidRole(role: unknown): role is UserRole {
  return (
    typeof role === "string" &&
    USER_ROLES.some(
      (validRole) => validRole === role
    )
  );
}

function parseUserId(id: string): number | null {
  const parsedId = Number(id);

  if (
    !Number.isInteger(parsedId) ||
    parsedId <= 0
  ) {
    return null;
  }

  return parsedId;
}

export async function PATCH(
  request: Request,
  { params }: UserRouteContext
) {
  const authResult = await requireAdmin();

  if (authResult.response) {
    return authResult.response;
  }

  try {
    const { id } = await params;
    const userId = parseUserId(id);

    if (!userId) {
      return NextResponse.json(
        {
          message: "Invalid user ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },

        select: {
          id: true,
          passwordHash: true,
        },
      });

    if (!existingUser) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (existingUser.passwordHash) {
      return NextResponse.json(
        {
          message:
            "Login accounts cannot be edited.",
        },
        {
          status: 403,
        }
      );
    }

    const body =
      (await request.json()) as UpdateUserBody;

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
          message:
            "Please enter a valid email.",
        },
        {
          status: 400,
        }
      );
    }

    if (!isValidRole(role)) {
      return NextResponse.json(
        {
          message:
            "Please select a valid role.",
        },
        {
          status: 400,
        }
      );
    }

    const userWithSameEmail =
      await prisma.user.findUnique({
        where: {
          email,
        },

        select: {
          id: true,
        },
      });

    if (
      userWithSameEmail &&
      userWithSameEmail.id !== userId
    ) {
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

    const updatedUser =
      await prisma.user.update({
        where: {
          id: userId,
        },

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

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(
      "PATCH /api/users/[id] failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Unable to update user.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: UserRouteContext
) {
  const authResult = await requireAdmin();

  if (authResult.response) {
    return authResult.response;
  }

  try {
    const { id } = await params;
    const userId = parseUserId(id);

    if (!userId) {
      return NextResponse.json(
        {
          message: "Invalid user ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },

        select: {
          id: true,
          passwordHash: true,
        },
      });

    if (!existingUser) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (existingUser.passwordHash) {
      return NextResponse.json(
        {
          message:
            "Login accounts cannot be deleted.",
        },
        {
          status: 403,
        }
      );
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error(
      "DELETE /api/users/[id] failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Unable to delete user.",
      },
      {
        status: 500,
      }
    );
  }
}