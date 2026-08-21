import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { MAX_EMAIL_LENGTH } from "@/constants/emailRules";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "@/constants/passwordRules";
import { USER_ROLES } from "@/constants/userRoles";

import { requireAdmin, requireAuthenticatedUser } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";

const createUserSchema = z.object({
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

  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `Password must contain at least ${MIN_PASSWORD_LENGTH} characters.`)
    .max(MAX_PASSWORD_LENGTH, `Password must contain at most ${MAX_PASSWORD_LENGTH} characters.`),
});

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export async function GET() {
  const authResult = await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        workspaceId: authResult.session.user.workspaceId,
      },

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
        message: "Unable to load members.",
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
    const body: unknown = await request.json();

    const parsedBody = createUserSchema.safeParse(body);

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

    const passwordHash = await hash(parsedBody.data.password, 12);

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
          message: "A member with this email already exists.",
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
        passwordHash,
        workspaceId: authResult.session.user.workspaceId,
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

    console.error("POST /api/users failed:", error);

    return NextResponse.json(
      {
        message: "Unable to create member.",
      },
      {
        status: 500,
      }
    );
  }
}
