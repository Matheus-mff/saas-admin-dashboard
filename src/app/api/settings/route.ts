import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAuthenticatedUser } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

const updateSettingsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name is too long."),

  email: z.email({
    error: "Please enter a valid email.",
  }),

  company: z
    .string()
    .trim()
    .min(1, "Company name is required.")
    .max(100, "Company name is too long."),

  emailNotifications: z.boolean(),
});

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

export async function GET() {
  const authResult =
    await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  const userId = parseUserId(
    authResult.session.user.id
  );

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
    const settings =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },

        select: {
          name: true,
          email: true,
          company: true,
          emailNotifications: true,
        },
      });

    if (!settings) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error(
      "GET /api/settings failed:",
      error
    );

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
  const authResult =
    await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  const userId = parseUserId(
    authResult.session.user.id
  );

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

    const parsedBody =
      updateSettingsSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message:
            parsedBody.error.issues[0]?.message ??
            "Invalid settings data.",
        },
        {
          status: 400,
        }
      );
    }

    const name = parsedBody.data.name;
    const email = parsedBody.data.email
      .trim()
      .toLowerCase();

    const company = parsedBody.data.company;
    const emailNotifications =
      parsedBody.data.emailNotifications;

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

    const updatedSettings =
      await prisma.user.update({
        where: {
          id: userId,
        },

        data: {
          name,
          email,
          company,
          emailNotifications,
        },

        select: {
          name: true,
          email: true,
          company: true,
          emailNotifications: true,
        },
      });

    return NextResponse.json(
      updatedSettings
    );
  } catch (error) {
    console.error(
      "PATCH /api/settings failed:",
      error
    );

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