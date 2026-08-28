import { NextResponse } from "next/server";
import { z } from "zod";

import { MAX_EMAIL_LENGTH } from "@/constants/emailRules";
import { USER_ROLES } from "@/constants/userRoles";

import { requireAdmin } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

const PROTECTED_DEMO_EMAILS = ["admin@email.com", "manager@email.com", "user@email.com"];

const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters.")
    .max(100, "Name is too long."),

  email: z
    .string()
    .trim()
    .max(MAX_EMAIL_LENGTH, `Email must contain at most ${MAX_EMAIL_LENGTH} characters.`)
    .pipe(
      z.email({
        error: "Please enter a valid email.",
      })
    ),

  role: z.enum(USER_ROLES),
});

type UserRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseUserId(id: string): number | null {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return null;
  }

  return parsedId;
}

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export async function PATCH(request: Request, { params }: UserRouteContext) {
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
          message: "Invalid member ID.",
        },
        {
          status: 400,
        }
      );
    }

    const workspaceId = authResult.session.user.workspaceId;
    const currentUserId = Number(authResult.session.user.id);

    const existingUser = await prisma.user.findFirst({
      where: {
        id: userId,
        workspaceId,
      },

      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          message: "Member not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Keep the public demo accounts unchanged so portfolio reviewers can always
    // use the published credentials to test every permission level
    if (PROTECTED_DEMO_EMAILS.includes(existingUser.email)) {
      return NextResponse.json(
        {
          message: "Demo accounts cannot be edited.",
        },
        {
          status: 403,
        }
      );
    }

    const body: unknown = await request.json();

    const parsedBody = updateUserSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: parsedBody.error.issues[0]?.message ?? "Invalid member data.",
        },
        {
          status: 400,
        }
      );
    }

    const name = parsedBody.data.name;
    const email = parsedBody.data.email.trim().toLowerCase();
    const role = parsedBody.data.role;

    if (userId === currentUserId && role !== "Admin") {
      return NextResponse.json(
        {
          message: "You cannot remove your own Admin role.",
        },
        {
          status: 403,
        }
      );
    }

    if (existingUser.role === "Admin" && role !== "Admin") {
      const adminCount = await prisma.user.count({
        where: {
          workspaceId,
          role: "Admin",
        },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          {
            message: "The workspace must have at least one Admin.",
          },
          {
            status: 403,
          }
        );
      }
    }

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },

      select: {
        id: true,
      },
    });

    if (userWithSameEmail && userWithSameEmail.id !== userId) {
      return NextResponse.json(
        {
          message: "A member with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const updatedUser = await prisma.user.update({
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

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        {
          message: "A member with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    console.error("PATCH /api/users/[id] failed:", error);

    return NextResponse.json(
      {
        message: "Unable to update member.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(_request: Request, { params }: UserRouteContext) {
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
          message: "Invalid member ID.",
        },
        {
          status: 400,
        }
      );
    }

    const workspaceId = authResult.session.user.workspaceId;
    const currentUserId = Number(authResult.session.user.id);

    if (userId === currentUserId) {
      return NextResponse.json(
        {
          message: "You cannot delete your own account.",
        },
        {
          status: 403,
        }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        id: userId,
        workspaceId,
      },

      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          message: "Member not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Keep the public demo accounts available so portfolio reviewers can always
    // test the Admin, Manager, and User permission levels
    if (PROTECTED_DEMO_EMAILS.includes(existingUser.email)) {
      return NextResponse.json(
        {
          message: "Demo accounts cannot be deleted.",
        },
        {
          status: 403,
        }
      );
    }

    if (existingUser.role === "Admin") {
      const adminCount = await prisma.user.count({
        where: {
          workspaceId,
          role: "Admin",
        },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          {
            message: "The workspace must have at least one Admin.",
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
    console.error("DELETE /api/users/[id] failed:", error);

    return NextResponse.json(
      {
        message: "Unable to delete member.",
      },
      {
        status: 500,
      }
    );
  }
}
