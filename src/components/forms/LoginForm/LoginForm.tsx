"use client";

import { useActionState } from "react";

import {
  login,
  LoginState,
} from "@/app/(auth)/login/actions";

const initialState: LoginState = {
  error: "",
};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form
      action={formAction}
      className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm"
    >
      <h1 className="text-3xl font-bold">
        Welcome back
      </h1>

      <p className="mt-2 text-gray-500">
        Sign in to access your dashboard.
      </p>

      <div className="mt-8">
        <label className="mb-1 block font-medium">
          Email
        </label>

        <input
          type="email"
          name="email"
          placeholder="admin@email.com"
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1 block font-medium">
          Password
        </label>

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      {state.error && (
        <p className="mt-4 text-sm text-red-500">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending
          ? "Signing in..."
          : "Sign In"}
      </button>

      <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
        <p>
          Demo credentials:
        </p>

        <p className="mt-1">
          admin@email.com
        </p>

        <p>
          admin123
        </p>
      </div>
    </form>
  );
}