"use client";

import { useState } from "react";

import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "@/constants/passwordRules";
import { changePassword } from "@/services/passwordService";

type ChangePasswordFormProps = {
  onSuccess: (message: string) => void;
  isDisabled?: boolean;
};

type PasswordErrors = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePasswordForm({
  onSuccess,
  isDisabled = false,
}: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<PasswordErrors>({
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
      newErrors.currentPassword = "Current password is required.";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required.";
    } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
      newErrors.newPassword = `New password must contain at least ${MIN_PASSWORD_LENGTH} characters.`;
    } else if (newPassword.length > MAX_PASSWORD_LENGTH) {
      newErrors.newPassword = `New password must contain at most ${MAX_PASSWORD_LENGTH} characters.`;
    } else if (newPassword === currentPassword) {
      newErrors.newPassword = "Your new password must be different from your current password.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password.";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "New passwords do not match.";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  }

  function clearFieldError(field: keyof PasswordErrors) {
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

    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      onSuccess("Password changed successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to change password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <fieldset disabled={isSubmitting || isDisabled} className="contents">
        <section className="card overflow-hidden">
          <div className="p-6">
            <h2 className="section-title">Password</h2>

            <p className="mt-1 text-sm muted-text">
              {isDisabled
                ? "Demo account passwords are locked so the published credentials stay available."
                : "Replace your current account password."}
            </p>

            <div className="mt-6">
              <label htmlFor="current-password" className="mb-2 block text-sm font-semibold">
                Current password
              </label>

              <input
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  clearFieldError("currentPassword");
                }}
                className={`form-control ${errors.currentPassword ? "form-control-error" : ""}`}
              />

              {errors.currentPassword && (
                <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
                  {errors.currentPassword}
                </p>
              )}
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="new-password" className="mb-2 block text-sm font-semibold">
                  New password
                </label>

                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  minLength={MIN_PASSWORD_LENGTH}
                  maxLength={MAX_PASSWORD_LENGTH}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    clearFieldError("newPassword");
                  }}
                  className={`form-control ${errors.newPassword ? "form-control-error" : ""}`}
                />

                {errors.newPassword && (
                  <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirm-new-password" className="mb-2 block text-sm font-semibold">
                  Confirm new password
                </label>

                <input
                  id="confirm-new-password"
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

            <p className="mt-4 text-xs muted-text">
              {isDisabled
                ? "Password changes are disabled for public demo accounts."
                : `Use ${MIN_PASSWORD_LENGTH}–${MAX_PASSWORD_LENGTH} characters.`}
            </p>

            {errorMessage && (
              <p className="mt-4 text-sm text-[var(--danger)]" role="alert">
                {errorMessage}
              </p>
            )}
          </div>

          <div className="settings-card-footer flex justify-end px-6 py-4">
            <button type="submit" className="primary-button shrink-0">
              {isSubmitting ? "Changing password..." : "Change Password"}
            </button>
          </div>
        </section>
      </fieldset>
    </form>
  );
}
