"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { MAX_EMAIL_LENGTH } from "@/constants/emailRules";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "@/constants/passwordRules";

import { registerAccount, RegisterInput } from "@/services/registerService";

type RegisterErrors = {
  name: string;
  email: string;
  workspaceName: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<RegisterErrors>({
    name: "",
    email: "",
    workspaceName: "",
    password: "",
    confirmPassword: "",
  });

  function validate() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedWorkspaceName = workspaceName.trim();

    const newErrors: RegisterErrors = {
      name: "",
      email: "",
      workspaceName: "",
      password: "",
      confirmPassword: "",
    };

    if (!trimmedName) {
      newErrors.name = "Name is required.";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Name must contain at least 2 characters.";
    } else if (trimmedName.length > 100) {
      newErrors.name = "Name is too long.";
    }

    if (!trimmedEmail) {
      newErrors.email = "Email is required.";
    } else if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
      newErrors.email = `Email must contain at most ${MAX_EMAIL_LENGTH} characters.`;
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!trimmedWorkspaceName) {
      newErrors.workspaceName = "Workspace name is required.";
    } else if (trimmedWorkspaceName.length < 2) {
      newErrors.workspaceName = "Workspace name must contain at least 2 characters.";
    } else if (trimmedWorkspaceName.length > 100) {
      newErrors.workspaceName = "Workspace name is too long.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must contain at least ${MIN_PASSWORD_LENGTH} characters.`;
    } else if (password.length > MAX_PASSWORD_LENGTH) {
      newErrors.password = `Password must contain at most ${MAX_PASSWORD_LENGTH} characters.`;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  }

  function clearFieldError(field: keyof RegisterErrors) {
    if (!errors[field]) return;

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) return;
    if (!validate()) return;

    setErrorMessage("");
    setIsSubmitting(true);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedWorkspaceName = workspaceName.trim();

    const registrationData: RegisterInput = {
      name: trimmedName,
      email: trimmedEmail,
      workspaceName: trimmedWorkspaceName,
      password,
      confirmPassword,
    };

    try {
      await registerAccount(registrationData);

      const signInResult = await signIn("credentials", {
        email: trimmedEmail,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setErrorMessage(
          "Your account was created, but automatic sign-in failed. Please sign in manually."
        );

        return;
      }

      window.location.href = "/dashboard";
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="auth-card max-w-lg p-7 sm:p-9">
      <div className="mb-8 flex items-center gap-3">
        <span className="auth-brand-mark">SA</span>
        <span className="text-sm font-bold tracking-[-0.02em]">SaaS Admin</span>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.035em]">Create your workspace</h1>

        <p className="mt-2 muted-text">Create a new workspace and start managing your own data.</p>
      </div>

      <fieldset disabled={isSubmitting} className="contents">
        <div className="mt-6">
          <label htmlFor="register-name" className="mb-2 block text-sm font-semibold">
            Full name
          </label>

          <input
            id="register-name"
            type="text"
            autoComplete="name"
            value={name}
            minLength={2}
            maxLength={100}
            onChange={(e) => {
              setName(e.target.value);
              clearFieldError("name");
            }}
            className={`form-control ${errors.name ? "form-control-error" : ""}`}
          />

          {errors.name && (
            <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label htmlFor="register-email" className="mb-2 block text-sm font-semibold">
            Email
          </label>

          <input
            id="register-email"
            type="email"
            autoComplete="email"
            value={email}
            maxLength={MAX_EMAIL_LENGTH}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
            }}
            className={`form-control ${errors.email ? "form-control-error" : ""}`}
          />

          {errors.email && (
            <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label htmlFor="register-workspace-name" className="mb-2 block text-sm font-semibold">
            Workspace name
          </label>

          <input
            id="register-workspace-name"
            type="text"
            autoComplete="organization"
            value={workspaceName}
            minLength={2}
            maxLength={100}
            onChange={(e) => {
              setWorkspaceName(e.target.value);
              clearFieldError("workspaceName");
            }}
            className={`form-control ${errors.workspaceName ? "form-control-error" : ""}`}
          />

          <p className="mt-1 text-sm muted-text">
            This can be your company, team, or project name.
          </p>

          {errors.workspaceName && (
            <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
              {errors.workspaceName}
            </p>
          )}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="register-password" className="mb-2 block text-sm font-semibold">
              Password
            </label>

            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              value={password}
              minLength={MIN_PASSWORD_LENGTH}
              maxLength={MAX_PASSWORD_LENGTH}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError("password");
              }}
              className={`form-control ${errors.password ? "form-control-error" : ""}`}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="register-confirm-password" className="mb-2 block text-sm font-semibold">
              Confirm password
            </label>

            <input
              id="register-confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              minLength={MIN_PASSWORD_LENGTH}
              maxLength={MAX_PASSWORD_LENGTH}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearFieldError("confirmPassword");
              }}
              className={`form-control ${errors.confirmPassword ? "form-control-error" : ""}`}
            />

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {errorMessage && (
          <p className="mt-4 text-sm text-[var(--danger)]" role="alert">
            {errorMessage}
          </p>
        )}

        <button type="submit" className="primary-button mt-6 w-full">
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </fieldset>

      <p className="mt-6 text-center text-sm muted-text">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[var(--foreground)] underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  );
}
