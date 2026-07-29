import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters.")
      .max(100, "Name is too long."),

    email: z.email({
      error: "Please enter a valid email.",
    }),

    company: z
      .string()
      .trim()
      .min(
        2,
        "Workspace name must contain at least 2 characters."
      )
      .max(100, "Workspace name is too long."),

    password: z
      .string()
      .min(
        8,
        "Password must contain at least 8 characters."
      )
      .max(100, "Password is too long."),

    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    }
  );

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

export async function POST(request: Request) {
  try {
    const body: unknown =
      await request.json();

    const parsedBody =
      registerSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message:
            parsedBody.error.issues[0]
              ?.message ??
            "Invalid registration data.",
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

    const password =
      parsedBody.data.password;

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
            "An account with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const passwordHash = await hash(
      password,
      12
    );

    await prisma.workspace.create({
      data: {
        name: company,

        users: {
          create: {
            name,
            email,
            passwordHash,
            role: "Admin",
            emailNotifications: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message:
          "Account created successfully.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        {
          message:
            "An account with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    console.error(
      "POST /api/register failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to create account.",
      },
      {
        status: 500,
      }
    );
  }
}