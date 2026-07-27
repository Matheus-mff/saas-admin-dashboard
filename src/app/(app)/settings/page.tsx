"use client";

import SettingsForm from "@/components/forms/SettingsForm/SettingsForm";
import Toast from "@/components/ui/Toast/Toast";

import { useToast } from "@/hooks/useToast";

export default function SettingsPage() {
  const { toastMessage, toastType, showToast } = useToast();

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Settings
      </h1>

      <p className="mt-2 muted-text">
        Manage your account and workspace preferences.
      </p>

      <div className="mt-8">
        <SettingsForm
          onSave={() => {
            showToast("Settings saved successfully.");
          }}
        />
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
        />
      )}
    </div>
  );
}