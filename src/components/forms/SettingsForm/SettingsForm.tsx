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
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Profile</h2>

        <p className="mt-1 text-sm text-gray-500">
          Update your personal information.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block font-medium">Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Workspace</h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage your workspace information.
        </p>

        <div className="mt-6">
          <label className="mb-1 block font-medium">Company name</label>

          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Notifications</h2>

        <p className="mt-1 text-sm text-gray-500">
          Choose how you receive updates.
        </p>

        <label className="mt-6 flex items-center justify-between gap-4">
          <div>
            <p className="font-medium">Email notifications</p>

            <p className="text-sm text-gray-500">
              Receive important account and activity updates.
            </p>
          </div>

          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            className="h-5 w-5"
          />
        </label>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}