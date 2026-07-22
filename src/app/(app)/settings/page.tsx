"use client";

import { useEffect, useState } from "react";

import SettingsForm from "@/components/forms/SettingsForm/SettingsForm";
import Toast from "@/components/ui/Toast/Toast";

export default function SettingsPage() {
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!toastMessage) return;

    const timeout = setTimeout(() => {
      setToastMessage("");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [toastMessage]);

  return (
    <div>
      <h1 className="text-3xl font-bold">Settings</h1>

      <p className="mt-2 text-gray-500">
        Manage your account and workspace preferences.
      </p>

      <div className="mt-8">
        <SettingsForm
          onSave={() => {
            setToastMessage("Settings saved successfully.");
          }}
        />
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
        />
      )}
    </div>
  );
}