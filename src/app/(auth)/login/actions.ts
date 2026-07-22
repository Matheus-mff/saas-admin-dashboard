"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = {
  error: string;
};

export async function login(
  previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    email !== "admin@email.com" ||
    password !== "admin123"
  ) {
    return {
      error: "Invalid email or password.",
    };
  }

  const cookieStore = await cookies();

  cookieStore.set("session", "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect("/dashboard");
}