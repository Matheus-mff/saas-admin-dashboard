"use client";

import { useState } from "react";

type SettingsFormProps = {
  onSave: () => void;
};

export default function SettingsForm({ onSave }: SettingsFormProps) {
  const [name, setName] = useState("Matheus");
  const [email, setEmail] = useState("matheus@email.com");
  const [company, setCompany] = useState("Acme SaaS");
  const [emailNotifications, setEmailNotifications] = useState(true);

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    onSave();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="card p-6">
        <h2 className="text-lg font-semibold">Profile</h2>

        <p className="mt-1 text-sm muted-text">
          Update your personal information.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block font-medium">Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-semibold">Workspace</h2>

        <p className="mt-1 text-sm muted-text">
          Manage your workspace information.
        </p>

        <div className="mt-6">
          <label className="mb-1 block font-medium">Company name</label>

          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="form-control"
          />
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-semibold">Notifications</h2>

        <p className="mt-1 text-sm muted-text">
          Choose how you receive updates.
        </p>

        <label className="mt-6 flex items-center justify-between gap-4">
          <div>
            <p className="font-medium">Email notifications</p>

            <p className="mt-1 text-sm muted-text">
              Receive important account and activity updates.
            </p>
          </div>

          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            className="form-control"
          />
        </label>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          className="primary-button"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}