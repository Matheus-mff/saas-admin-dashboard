import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      "Name must contain at least 2 characters."
    )
    .max(
      100,
      "Name is too long."
    ),

  email: z.email({
    error:
      "Please enter a valid email.",
  }),

  role: z.enum([
    "Admin",
    "Manager",
    "User",
  ]),
});

type UserRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseUserId(
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

function isUniqueConstraintError(
  error: unknown
): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function PATCH(
  request: Request,
  { params }: UserRouteContext
) {
  const authResult =
    await requireAdmin();

  if (authResult.response) {
    return authResult.response;
  }

  try {
    const { id } = await params;
    const userId = parseUserId(id);

    if (!userId) {
      return NextResponse.json(
        {
          message:
            "Invalid user ID.",
        },
        {
          status: 400,
        }
      );
    }

    const workspaceId =
      authResult.session.user
        .workspaceId;

    const currentUserId = Number(
      authResult.session.user.id
    );

    const existingUser =
      await prisma.user.findFirst({
        where: {
          id: userId,
          workspaceId,
        },

        select: {
          id: true,
          role: true,
        },
      });

    if (!existingUser) {
      return NextResponse.json(
        {
          message:
            "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const body: unknown =
      await request.json();

    const parsedBody =
      updateUserSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message:
            parsedBody.error.issues[0]
              ?.message ??
            "Invalid user data.",
        },
        {
          status: 400,
        }
      );
    }

    const name =
      parsedBody.data.name;

    const email =
      parsedBody.data.email
        .trim()
        .toLowerCase();

    const role =
      parsedBody.data.role;

    if (
      userId === currentUserId &&
      role !== "Admin"
    ) {
      return NextResponse.json(
        {
          message:
            "You cannot remove your own Admin role.",
        },
        {
          status: 403,
        }
      );
    }

    if (
      existingUser.role === "Admin" &&
      role !== "Admin"
    ) {
      const adminCount =
        await prisma.user.count({
          where: {
            workspaceId,
            role: "Admin",
          },
        });

      if (adminCount <= 1) {
        return NextResponse.json(
          {
            message:
              "The workspace must have at least one Admin.",
          },
          {
            status: 403,
          }
        );
      }
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
          workspaceId,
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

    return NextResponse.json(
      updatedUser
    );
  } catch (error) {
    if (
      isUniqueConstraintError(error)
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

    console.error(
      "PATCH /api/users/[id] failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to update user.",
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
  const authResult =
    await requireAdmin();

  if (authResult.response) {
    return authResult.response;
  }

  try {
    const { id } = await params;
    const userId = parseUserId(id);

    if (!userId) {
      return NextResponse.json(
        {
          message:
            "Invalid user ID.",
        },
        {
          status: 400,
        }
      );
    }

    const workspaceId =
      authResult.session.user
        .workspaceId;

    const currentUserId = Number(
      authResult.session.user.id
    );

    if (userId === currentUserId) {
      return NextResponse.json(
        {
          message:
            "You cannot delete your own account.",
        },
        {
          status: 403,
        }
      );
    }

    const existingUser =
      await prisma.user.findFirst({
        where: {
          id: userId,
          workspaceId,
        },

        select: {
          id: true,
          role: true,
        },
      });

    if (!existingUser) {
      return NextResponse.json(
        {
          message:
            "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      existingUser.role === "Admin"
    ) {
      const adminCount =
        await prisma.user.count({
          where: {
            workspaceId,
            role: "Admin",
          },
        });

      if (adminCount <= 1) {
        return NextResponse.json(
          {
            message:
              "The workspace must have at least one Admin.",
          },
          {
            status: 403,
          }
        );
      }
    }

    await prisma.user.delete({
      where: {
        id: userId,
        workspaceId,
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
        message:
          "Unable to delete user.",
      },
      {
        status: 500,
      }
    );
  }
}