import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuthenticatedUser } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

const updateSettingsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      1,
      "Name is required."
    )
    .max(
      100,
      "Name is too long."
    ),

  email: z.email({
    error:
      "Please enter a valid email.",
  }),

  company: z
    .string()
    .trim()
    .min(
      1,
      "Workspace name is required."
    )
    .max(
      100,
      "Workspace name is too long."
    )
    .optional(),

  emailNotifications:
    z.boolean(),
});

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

export async function GET() {
  const authResult =
    await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  const userId = parseUserId(
    authResult.session.user.id
  );

  const workspaceId =
    authResult.session.user
      .workspaceId;

  if (!userId) {
    return NextResponse.json(
      {
        message:
          "Invalid session user.",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const user =
      await prisma.user.findFirst({
        where: {
          id: userId,
          workspaceId,
        },

        select: {
          name: true,
          email: true,
          emailNotifications: true,

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
          message:
            "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      company:
        user.workspace.name,
      emailNotifications:
        user.emailNotifications,
    });
  } catch (error) {
    console.error(
      "GET /api/settings failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to load settings.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request
) {
  const authResult =
    await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  const userId = parseUserId(
    authResult.session.user.id
  );

  const workspaceId =
    authResult.session.user
      .workspaceId;

  const isAdmin =
    authResult.session.user.role ===
    "Admin";

  if (!userId) {
    return NextResponse.json(
      {
        message:
          "Invalid session user.",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const body: unknown =
      await request.json();

    const parsedBody =
      updateSettingsSchema.safeParse(
        body
      );

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message:
            parsedBody.error
              .issues[0]?.message ??
            "Invalid settings data.",
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

    const company =
      parsedBody.data.company;

    const emailNotifications =
      parsedBody.data
        .emailNotifications;

    if (
      !isAdmin &&
      company !== undefined
    ) {
      return NextResponse.json(
        {
          message:
            "Only an Admin can update the workspace name.",
        },
        {
          status: 403,
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
      userWithSameEmail.id !==
      userId
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

    const existingUser =
      await prisma.user.findFirst({
        where: {
          id: userId,
          workspaceId,
        },

        select: {
          id: true,
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

    const updatedUser =
      await prisma.user.update({
        where: {
          id: userId,
          workspaceId,
        },

        data: {
          name,
          email,
          emailNotifications,
        },

        select: {
          name: true,
          email: true,
          emailNotifications: true,
        },
      });

    let workspaceName: string;

    if (
      isAdmin &&
      company !== undefined
    ) {
      const updatedWorkspace =
        await prisma.workspace.update({
          where: {
            id: workspaceId,
          },

          data: {
            name: company,
          },

          select: {
            name: true,
          },
        });

      workspaceName =
        updatedWorkspace.name;
    } else {
      const workspace =
        await prisma.workspace.findUnique({
          where: {
            id: workspaceId,
          },

          select: {
            name: true,
          },
        });

      if (!workspace) {
        return NextResponse.json(
          {
            message:
              "Workspace not found.",
          },
          {
            status: 404,
          }
        );
      }

      workspaceName =
        workspace.name;
    }

    return NextResponse.json({
      name: updatedUser.name,
      email: updatedUser.email,
      company: workspaceName,
      emailNotifications:
        updatedUser.emailNotifications,
    });
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
      "PATCH /api/settings failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to save settings.",
      },
      {
        status: 500,
      }
    );
  }
}