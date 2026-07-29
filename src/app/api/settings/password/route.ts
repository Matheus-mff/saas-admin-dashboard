import {
  compare,
  hash,
} from "bcryptjs";

import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuthenticatedUser } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(
        1,
        "Current password is required."
      ),

    newPassword: z
      .string()
      .min(
        8,
        "New password must contain at least 8 characters."
      )
      .max(
        100,
        "New password is too long."
      ),

    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.newPassword ===
      data.confirmPassword,
    {
      message:
        "New passwords do not match.",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) =>
      data.currentPassword !==
      data.newPassword,
    {
      message:
        "Your new password must be different from your current password.",
      path: ["newPassword"],
    }
  );

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
    authResult.session.user.workspaceId;

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
      changePasswordSchema.safeParse(
        body
      );

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message:
            parsedBody.error.issues[0]
              ?.message ??
            "Invalid password data.",
        },
        {
          status: 400,
        }
      );
    }

    const user =
      await prisma.user.findFirst({
        where: {
          id: userId,
          workspaceId,
        },

        select: {
          id: true,
          passwordHash: true,
        },
      });

    if (!user?.passwordHash) {
      return NextResponse.json(
        {
          message:
            "This account does not have a password.",
        },
        {
          status: 400,
        }
      );
    }

    const passwordMatches =
      await compare(
        parsedBody.data
          .currentPassword,
        user.passwordHash
      );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          message:
            "Current password is incorrect.",
        },
        {
          status: 400,
        }
      );
    }

    const newPasswordHash =
      await hash(
        parsedBody.data.newPassword,
        12
      );

    await prisma.user.update({
      where: {
        id: user.id,
      },

      data: {
        passwordHash:
          newPasswordHash,
      },
    });

    return NextResponse.json({
      message:
        "Password changed successfully.",
    });
  } catch (error) {
    console.error(
      "PATCH /api/settings/password failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to change password.",
      },
      {
        status: 500,
      }
    );
  }
}