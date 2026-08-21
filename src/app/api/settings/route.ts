import { NextResponse } from "next/server";
import { z } from "zod";

import { MAX_EMAIL_LENGTH } from "@/constants/emailRules";

import { requireAuthenticatedUser } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

const PROTECTED_DEMO_EMAILS = ["admin@email.com", "manager@email.com", "user@email.com"];

const updateSettingsSchema = z.object({
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

  workspaceName: z
    .string()
    .trim()
    .min(2, "Workspace name must contain at least 2 characters.")
    .max(100, "Workspace name is too long.")
    .optional(),
});

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

export async function GET() {
  const authResult = await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  const userId = parseUserId(authResult.session.user.id);
  const workspaceId = authResult.session.user.workspaceId;

  if (!userId) {
    return NextResponse.json(
      {
        message: "Invalid session user.",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        workspaceId,
      },

      select: {
        name: true,
        email: true,

        workspace: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      workspaceName: user.workspace.name,
    });
  } catch (error) {
    console.error("GET /api/settings failed:", error);

    return NextResponse.json(
      {
        message: "Unable to load settings.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: Request) {
  const authResult = await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  const userId = parseUserId(authResult.session.user.id);
  const workspaceId = authResult.session.user.workspaceId;
  const isAdmin = authResult.session.user.role === "Admin";

  if (!userId) {
    return NextResponse.json(
      {
        message: "Invalid session user.",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const body: unknown = await request.json();
    const parsedBody = updateSettingsSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: parsedBody.error.issues[0]?.message ?? "Invalid settings data.",
        },
        {
          status: 400,
        }
      );
    }

    const name = parsedBody.data.name;
    const email = parsedBody.data.email.trim().toLowerCase();
    const workspaceName = parsedBody.data.workspaceName;

    if (!isAdmin && workspaceName !== undefined) {
      return NextResponse.json(
        {
          message: "Only an Admin can update the workspace name.",
        },
        {
          status: 403,
        }
      );
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
          message: "A user with this email already exists.",
        },
        {
          status: 409,
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
        name: true,
        email: true,
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

    // Demo reviewers must not be able to change the published demo credentials.
    // Admins can still update the workspace name as long as their own profile stays unchanged.
    if (
      PROTECTED_DEMO_EMAILS.includes(existingUser.email) &&
      (name !== existingUser.name || email !== existingUser.email)
    ) {
      return NextResponse.json(
        {
          message: "Demo account profile details cannot be edited.",
        },
        {
          status: 403,
        }
      );
    }

    const savedSettings = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: {
          id: userId,
          workspaceId,
        },

        data: {
          name,
          email,
        },

        select: {
          name: true,
          email: true,
        },
      });

      const workspace =
        isAdmin && workspaceName !== undefined
          ? await tx.workspace.update({
              where: {
                id: workspaceId,
              },

              data: {
                name: workspaceName,
              },

              select: {
                name: true,
              },
            })
          : await tx.workspace.findUniqueOrThrow({
              where: {
                id: workspaceId,
              },

              select: {
                name: true,
              },
            });

      return {
        name: updatedUser.name,
        email: updatedUser.email,
        workspaceName: workspace.name,
      };
    });

    return NextResponse.json(savedSettings);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        {
          message: "A user with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    console.error("PATCH /api/settings failed:", error);

    return NextResponse.json(
      {
        message: "Unable to save settings.",
      },
      {
        status: 500,
      }
    );
  }
}
