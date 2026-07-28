"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";

export async function login(
  _previousState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return "Invalid email or password.";
      }

      return "Unable to sign in. Please try again.";
    }

    throw error;
  }
}