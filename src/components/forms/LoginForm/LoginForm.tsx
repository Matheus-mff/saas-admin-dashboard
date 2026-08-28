"use client";

import Link from "next/link";

import { useActionState } from "react";

import { login } from "@/app/(auth)/login/actions";

import { MAX_EMAIL_LENGTH } from "@/constants/emailRules";

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="auth-card max-w-[460px] p-7 sm:p-9">
      <div className="mb-8 flex items-center gap-3">
        <span className="auth-brand-mark">SA</span>
        <span className="text-sm font-bold tracking-[-0.02em]">SaaS Admin</span>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.035em]">Sign in to your workspace</h1>

        <p className="mt-2 text-sm leading-6 muted-text">
          Use a demo account or sign in with your own workspace credentials.
        </p>
      </div>

      <div className="mt-7">
        <label htmlFor="login-email" className="mb-2 block text-sm font-semibold">
          Email address
        </label>

        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue="admin@email.com"
          maxLength={MAX_EMAIL_LENGTH}
          disabled={isPending}
          required
          className="form-control"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="login-password" className="mb-2 block text-sm font-semibold">
          Password
        </label>

        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          defaultValue="AdminDemo2026!"
          disabled={isPending}
          required
          className="form-control"
        />
      </div>

      {errorMessage && (
        <p className="mt-4 text-sm text-[var(--danger)]" role="alert">
          {errorMessage}
        </p>
      )}

      <button type="submit" disabled={isPending} className="primary-button mt-6 w-full">
        {isPending ? "Signing in..." : "Continue"}
      </button>

      <div className="my-7 flex items-center gap-3">
        <span className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] muted-text">
          Demo access
        </span>
        <span className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <div className="auth-demo-panel divide-y divide-[var(--border)] text-sm">
        <div className="grid grid-cols-[76px_1fr] gap-3 px-4 py-3">
          <span className="font-semibold">Admin</span>
          <div className="min-w-0 muted-text">
            <p className="truncate">admin@email.com</p>
            <p className="truncate">AdminDemo2026!</p>
          </div>
        </div>

        <div className="grid grid-cols-[76px_1fr] gap-3 px-4 py-3">
          <span className="font-semibold">Manager</span>
          <div className="min-w-0 muted-text">
            <p className="truncate">manager@email.com</p>
            <p className="truncate">ManagerDemo2026!</p>
          </div>
        </div>

        <div className="grid grid-cols-[76px_1fr] gap-3 px-4 py-3">
          <span className="font-semibold">User</span>
          <div className="min-w-0 muted-text">
            <p className="truncate">user@email.com</p>
            <p className="truncate">UserDemo2026!</p>
          </div>
        </div>
      </div>

      <p className="mt-7 text-center text-sm muted-text">
        Want your own workspace?{" "}
        <Link
          href="/register"
          className="font-semibold text-[var(--foreground)] underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
