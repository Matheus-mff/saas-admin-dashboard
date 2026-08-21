"use client";

import { useState } from "react";

import { MAX_EMAIL_LENGTH } from "@/constants/emailRules";

import { Settings } from "@/types/settings";

type SettingsFormProps = {
  initialValues: Settings;
  canManageWorkspace: boolean;
  isProfileLocked?: boolean;
  onSave: (settings: Settings) => Promise<string | null>;
};

type SettingsErrors = {
  name: string;
  email: string;
  workspaceName: string;
};

export default function SettingsForm({
  initialValues,
  canManageWorkspace,
  isProfileLocked = false,
  onSave,
}: SettingsFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [email, setEmail] = useState(initialValues.email);
  const [workspaceName, setWorkspaceName] = useState(initialValues.workspaceName);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [errors, setErrors] = useState<SettingsErrors>({
    name: "",
    email: "",
    workspaceName: "",
  });

  function validate() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedWorkspaceName = workspaceName.trim();

    const newErrors: SettingsErrors = {
      name: "",
      email: "",
      workspaceName: "",
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

    if (canManageWorkspace) {
      if (!trimmedWorkspaceName) {
        newErrors.workspaceName = "Workspace name is required.";
      } else if (trimmedWorkspaceName.length < 2) {
        newErrors.workspaceName = "Workspace name must contain at least 2 characters.";
      } else if (trimmedWorkspaceName.length > 100) {
        newErrors.workspaceName = "Workspace name is too long.";
      }
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  }

  function clearFieldError(field: keyof SettingsErrors) {
    if (!errors[field]) return;

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSaving) return;

    setErrorMessage("");

    if (!validate()) return;

    setIsSaving(true);

    try {
      const error = await onSave({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        workspaceName: workspaceName.trim(),
      });

      if (error) {
        setErrorMessage(error);
      }
    } finally {
      setIsSaving(false);
    }
  }

  const saveDisabled = isSaving || (isProfileLocked && !canManageWorkspace);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <fieldset disabled={isSaving} className="contents">
        <section className="card overflow-hidden">
          <div className="p-6">
            <h2 className="section-title">Profile</h2>

            <p className="mt-1 text-sm muted-text">
              {isProfileLocked
                ? "Demo account profile details are locked so the published credentials stay available."
                : "Update your personal information."}
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="settings-name" className="mb-2 block text-sm font-semibold">
                  Name
                </label>

                <input
                  id="settings-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearFieldError("name");
                  }}
                  disabled={isProfileLocked}
                  required
                  minLength={2}
                  maxLength={100}
                  className={`form-control ${errors.name ? "form-control-error" : ""}`}
                />

                {errors.name && (
                  <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="settings-email" className="mb-2 block text-sm font-semibold">
                  Email
                </label>

                <input
                  id="settings-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  disabled={isProfileLocked}
                  maxLength={MAX_EMAIL_LENGTH}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError("email");
                  }}
                  required
                  className={`form-control ${errors.email ? "form-control-error" : ""}`}
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t p-6">
            <h2 className="section-title">Workspace</h2>

            <p className="mt-1 text-sm muted-text">
              {canManageWorkspace
                ? "Manage your workspace information."
                : "Only an Admin can change workspace information."}
            </p>

            <div className="mt-6">
              <label htmlFor="settings-workspace-name" className="mb-2 block text-sm font-semibold">
                Workspace name
              </label>

              <input
                id="settings-workspace-name"
                type="text"
                value={workspaceName}
                onChange={(e) => {
                  setWorkspaceName(e.target.value);
                  clearFieldError("workspaceName");
                }}
                disabled={isSaving || !canManageWorkspace}
                required={canManageWorkspace}
                minLength={2}
                maxLength={100}
                className={`form-control ${errors.workspaceName ? "form-control-error" : ""}`}
              />

              {errors.workspaceName && (
                <p className="mt-1 text-sm text-[var(--danger)]" role="alert">
                  {errors.workspaceName}
                </p>
              )}

              {!canManageWorkspace && (
                <p className="mt-2 text-sm muted-text">
                  Contact a workspace Admin to change this name.
                </p>
              )}
            </div>
          </div>

          {errorMessage && (
            <div className="border-t px-6 py-3.5">
              <p className="text-sm text-[var(--danger)]" role="alert">
                {errorMessage}
              </p>
            </div>
          )}

          <div className="settings-card-footer flex justify-end px-6 py-4">
            <button type="submit" className="primary-button shrink-0" disabled={saveDisabled}>
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </section>
      </fieldset>
    </form>
  );
}
