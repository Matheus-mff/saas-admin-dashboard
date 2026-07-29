"use client";

import Link from "next/link";

import { signIn } from "next-auth/react";

import { useState } from "react";

import {
  registerAccount,
  RegisterInput,
} from "@/services/registerService";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: React.SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting) return;

    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage(
        "Passwords do not match."
      );

      return;
    }

    setIsSubmitting(true);

    const registrationData: RegisterInput = {
      name,
      email,
      company,
      password,
      confirmPassword,
    };

    try {
      await registerAccount(
        registrationData
      );

      const signInResult = await signIn(
        "credentials",
        {
          email,
          password,
          redirect: false,
        }
      );

      if (signInResult?.error) {
        setErrorMessage(
          "Your account was created, but automatic sign-in failed. Please sign in manually."
        );

        return;
      }

      window.location.href = "/dashboard";
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create account."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card w-full max-w-lg p-8"
    >
      <div>
        <h1 className="text-2xl font-bold">
          Create your account
        </h1>

        <p className="mt-2 muted-text">
          Create a new workspace and start managing your own data.
        </p>
      </div>

      <fieldset
        disabled={isSubmitting}
        className="contents"
      >
        <div className="mt-6">
          <label
            htmlFor="register-name"
            className="mb-1 block font-medium"
          >
            Full name
          </label>

          <input
            id="register-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
            minLength={2}
            maxLength={100}
            className="form-control"
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="register-email"
            className="mb-1 block font-medium"
          >
            Email
          </label>

          <input
            id="register-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
            className="form-control"
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="register-company"
            className="mb-1 block font-medium"
          >
            Workspace name
          </label>

          <input
            id="register-company"
            type="text"
            autoComplete="organization"
            value={company}
            onChange={(event) =>
              setCompany(event.target.value)
            }
            required
            minLength={2}
            maxLength={100}
            className="form-control"
          />

          <p className="mt-1 text-sm muted-text">
            This can be your company, team, or project name.
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="register-password"
              className="mb-1 block font-medium"
            >
              Password
            </label>

            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              required
              minLength={8}
              maxLength={100}
              className="form-control"
            />
          </div>

          <div>
            <label
              htmlFor="register-confirm-password"
              className="mb-1 block font-medium"
            >
              Confirm password
            </label>

            <input
              id="register-confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              required
              minLength={8}
              maxLength={100}
              className="form-control"
            />
          </div>
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
          className="primary-button mt-6 w-full"
        >
          {isSubmitting
            ? "Creating account..."
            : "Create Account"}
        </button>
      </fieldset>

      <p className="mt-6 text-center text-sm muted-text">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}