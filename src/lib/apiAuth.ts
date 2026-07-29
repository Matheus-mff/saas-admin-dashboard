import { NextResponse } from "next/server";
import { Session } from "next-auth";

import { auth } from "@/auth";

type AuthSuccess = {
  session: Session;
  response: null;
};

type AuthFailure = {
  session: null;
  response: NextResponse;
};

type AuthResult =
  | AuthSuccess
  | AuthFailure;

export async function requireAuthenticatedUser(): Promise<AuthResult> {
  const session = await auth();

  if (!session?.user) {
    return {
      session: null,

      response: NextResponse.json(
        {
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      ),
    };
  }

  return {
    session,
    response: null,
  };
}

export async function requireAdmin(): Promise<AuthResult> {
  const result =
    await requireAuthenticatedUser();

  if (result.response) {
    return result;
  }

  if (
    result.session.user.role !==
    "Admin"
  ) {
    return {
      session: null,

      response: NextResponse.json(
        {
          message: "Forbidden.",
        },
        {
          status: 403,
        }
      ),
    };
  }

  return result;
}

export async function requireManagerOrAdmin(): Promise<AuthResult> {
  const result =
    await requireAuthenticatedUser();

  if (result.response) {
    return result;
  }

  const role =
    result.session.user.role;

  if (
    role !== "Admin" &&
    role !== "Manager"
  ) {
    return {
      session: null,

      response: NextResponse.json(
        {
          message: "Forbidden.",
        },
        {
          status: 403,
        }
      ),
    };
  }

  return result;
}