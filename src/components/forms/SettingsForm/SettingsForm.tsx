"use client";

import { useState } from "react";

import { Settings } from "@/types/settings";

type SettingsFormProps = {
  initialValues: Settings;
  canManageWorkspace: boolean;

  onSave: (
    settings: Settings
  ) => Promise<string | null>;
};

export default function SettingsForm({
  initialValues,
  canManageWorkspace,
  onSave,
}: SettingsFormProps) {
  const [name, setName] = useState(
    initialValues.name
  );

  const [email, setEmail] = useState(
    initialValues.email
  );

  const [company, setCompany] = useState(
    initialValues.company
  );

  const [
    emailNotifications,
    setEmailNotifications,
  ] = useState(
    initialValues.emailNotifications
  );

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  async function handleSubmit(
    event: React.SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSaving) return;

    setErrorMessage("");
    setIsSaving(true);

    try {
      const error = await onSave({
        name: name.trim(),
        email: email
          .trim()
          .toLowerCase(),
        company,
        emailNotifications,
      });

      if (error) {
        setErrorMessage(error);
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <fieldset
        disabled={isSaving}
        className="contents"
      >
        <section className="card p-6">
          <h2 className="text-lg font-semibold">
            Profile
          </h2>

          <p className="mt-1 text-sm muted-text">
            Update your personal information.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="settings-name"
                className="mb-1 block font-medium"
              >
                Name
              </label>

              <input
                id="settings-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                required
                minLength={1}
                maxLength={100}
                className="form-control"
              />
            </div>

            <div>
              <label
                htmlFor="settings-email"
                className="mb-1 block font-medium"
              >
                Email
              </label>

              <input
                id="settings-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                required
                className="form-control"
              />
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-semibold">
            Workspace
          </h2>

          <p className="mt-1 text-sm muted-text">
            {canManageWorkspace
              ? "Manage your workspace information."
              : "Only an Admin can change workspace information."}
          </p>

          <div className="mt-6">
            <label
              htmlFor="settings-company"
              className="mb-1 block font-medium"
            >
              Workspace name
            </label>

            <input
              id="settings-company"
              type="text"
              value={company}
              onChange={(event) =>
                setCompany(
                  event.target.value
                )
              }
              disabled={
                isSaving ||
                !canManageWorkspace
              }
              required={
                canManageWorkspace
              }
              minLength={1}
              maxLength={100}
              className="form-control"
            />

            {!canManageWorkspace && (
              <p className="mt-2 text-sm muted-text">
                Contact a workspace Admin to
                change this name.
              </p>
            )}
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-semibold">
            Notifications
          </h2>

          <p className="mt-1 text-sm muted-text">
            Choose how you receive updates.
          </p>

          <label className="mt-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">
                Email notifications
              </p>

              <p className="mt-1 text-sm muted-text">
                Receive important account and
                activity updates.
              </p>
            </div>

            <input
              type="checkbox"
              checked={
                emailNotifications
              }
              onChange={(event) =>
                setEmailNotifications(
                  event.target.checked
                )
              }
            />
          </label>
        </section>

        {errorMessage && (
          <p
            className="text-sm text-red-500"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="primary-button"
          >
            {isSaving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </fieldset>
    </form>
  );
}