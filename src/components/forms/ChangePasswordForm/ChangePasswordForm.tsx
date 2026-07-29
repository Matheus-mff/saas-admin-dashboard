"use client";

import { useState } from "react";

import { changePassword } from "@/services/passwordService";

type ChangePasswordFormProps = {
  onSuccess: (
    message: string
  ) => void;
};

type PasswordErrors = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePasswordForm({
  onSuccess,
}: ChangePasswordFormProps) {
  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [errors, setErrors] =
    useState<PasswordErrors>({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  function validate() {
    const newErrors: PasswordErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!currentPassword) {
      newErrors.currentPassword =
        "Current password is required.";
    }

    if (!newPassword) {
      newErrors.newPassword =
        "New password is required.";
    } else if (
      newPassword.length < 8
    ) {
      newErrors.newPassword =
        "New password must contain at least 8 characters.";
    } else if (
      newPassword.length > 100
    ) {
      newErrors.newPassword =
        "New password is too long.";
    } else if (
      newPassword ===
      currentPassword
    ) {
      newErrors.newPassword =
        "Your new password must be different.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your new password.";
    } else if (
      newPassword !==
      confirmPassword
    ) {
      newErrors.confirmPassword =
        "New passwords do not match.";
    }

    setErrors(newErrors);

    return !Object.values(
      newErrors
    ).some(Boolean);
  }

  function clearFieldError(
    field: keyof PasswordErrors
  ) {
    if (!errors[field]) return;

    setErrors(
      (previousErrors) => ({
        ...previousErrors,
        [field]: "",
      })
    );
  }

  async function handleSubmit(
    event: React.SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting) return;
    if (!validate()) return;

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      onSuccess(
        "Password changed successfully."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to change password."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="card p-6">
      <h2 className="text-lg font-semibold">
        Password
      </h2>

      <p className="mt-1 text-sm muted-text">
        Replace your current account password.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6"
      >
        <fieldset
          disabled={isSubmitting}
          className="contents"
        >
          <div>
            <label
              htmlFor="current-password"
              className="mb-1 block font-medium"
            >
              Current password
            </label>

            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => {
                setCurrentPassword(
                  event.target.value
                );

                clearFieldError(
                  "currentPassword"
                );
              }}
              className={`form-control ${errors.currentPassword
                  ? "form-control-error"
                  : ""
                }`}
            />

            {errors.currentPassword && (
              <p
                className="mt-1 text-sm text-red-500"
                role="alert"
              >
                {
                  errors.currentPassword
                }
              </p>
            )}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="new-password"
                className="mb-1 block font-medium"
              >
                New password
              </label>

              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(
                    event.target.value
                  );

                  clearFieldError(
                    "newPassword"
                  );
                }}
                className={`form-control ${errors.newPassword
                    ? "form-control-error"
                    : ""
                  }`}
              />

              {errors.newPassword && (
                <p
                  className="mt-1 text-sm text-red-500"
                  role="alert"
                >
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirm-new-password"
                className="mb-1 block font-medium"
              >
                Confirm new password
              </label>

              <input
                id="confirm-new-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(
                    event.target.value
                  );

                  clearFieldError(
                    "confirmPassword"
                  );
                }}
                className={`form-control ${errors.confirmPassword
                    ? "form-control-error"
                    : ""
                  }`}
              />

              {errors.confirmPassword && (
                <p
                  className="mt-1 text-sm text-red-500"
                  role="alert"
                >
                  {
                    errors.confirmPassword
                  }
                </p>
              )}
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

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="primary-button"
            >
              {isSubmitting
                ? "Changing password..."
                : "Change Password"}
            </button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}