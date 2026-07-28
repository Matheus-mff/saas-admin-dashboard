"use client";

import { useActionState } from "react";

import { login } from "@/app/(auth)/login/actions";

export default function LoginForm() {
  const [errorMessage, formAction, isPending] =
    useActionState(login, undefined);

  return (
    <form
      action={formAction}
      className="card w-full max-w-md p-8"
    >
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back
        </h1>

        <p className="mt-2 muted-text">
          Sign in to access your dashboard.
        </p>
      </div>

      <div className="mt-6">
        <label
          htmlFor="login-email"
          className="mb-1 block font-medium"
        >
          Email
        </label>

        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue="admin@email.com"
          disabled={isPending}
          required
          className="form-control"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="login-password"
          className="mb-1 block font-medium"
        >
          Password
        </label>

        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          defaultValue="admin123"
          disabled={isPending}
          required
          className="form-control"
        />
      </div>

      {errorMessage && (
        <p
          className="mt-4 text-sm text-red-500"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="primary-button mt-6 w-full"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>

      <div className="mt-6 rounded-lg bg-[var(--surface-secondary)] p-4 text-sm muted-text">
        <p className="font-medium">
          Demo credentials
        </p>

        <p className="mt-1">
          Email: admin@email.com
        </p>

        <p>
          Password: admin123
        </p>
      </div>
    </form>
  );
}