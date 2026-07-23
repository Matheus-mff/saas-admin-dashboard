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
      className="card w-full max-w-md p-8"
    >
      <h1 className="text-3xl font-bold">
        Welcome back
      </h1>

      <p className="mt-2 muted-text">
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
          className="form-control"
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
          className="form-control"
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
        className="primary-button mt-6 w-full"
      >
        {isPending
          ? "Signing in..."
          : "Sign In"}
      </button>

      <div className="mt-6 rounded-lg bg-[var(--surface-secondary)] p-4 text-sm muted-text">
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