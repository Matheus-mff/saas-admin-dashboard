import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
/*
Zod = the library
z = the object used to build schemas / similar to TypeScript, but it works while the application is running
schema = a set of validation rules
*/

import { MAX_EMAIL_LENGTH } from "@/constants/emailRules";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "@/constants/passwordRules";

import { prisma } from "@/lib/prisma";

const registerSchema = z
  .object({
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
      .max(100, "Workspace name is too long."),

    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Password must contain at least ${MIN_PASSWORD_LENGTH} characters.`)
      .max(MAX_PASSWORD_LENGTH, `Password must contain at most ${MAX_PASSWORD_LENGTH} characters.`),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const parsedBody = registerSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: parsedBody.error.issues[0]?.message ?? "Invalid registration data.",
        },
        {
          status: 400,
        }
      );
    }

    const name = parsedBody.data.name;
    const email = parsedBody.data.email.trim().toLowerCase();
    const workspaceName = parsedBody.data.workspaceName;
    const password = parsedBody.data.password;

    const existingUser = await prisma.user.findUnique({
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
          message: "An account with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const passwordHash = await hash(password, 12);

    await prisma.workspace.create({
      data: {
        name: workspaceName,

        users: {
          create: {
            name,
            email,
            passwordHash,
            role: "Admin",
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        {
          message: "An account with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    console.error("POST /api/register failed:", error);

    return NextResponse.json(
      {
        message: "Unable to create account.",
      },
      {
        status: 500,
      }
    );
  }
}
