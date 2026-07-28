"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SettingsForm from "@/components/forms/SettingsForm/SettingsForm";
import Toast from "@/components/ui/Toast/Toast";

import { useToast } from "@/hooks/useToast";

import {
  getSettings,
  updateSettings,
} from "@/services/settingsService";

import { Settings } from "@/types/settings";

export default function SettingsPage() {
  const router = useRouter();

  const {
    toastMessage,
    toastType,
    showToast,
  } = useToast();

  const [settings, setSettings] =
    useState<Settings | null>(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const loadedSettings =
          await getSettings();

        setSettings(loadedSettings);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load settings."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  async function handleSave(
    newSettings: Settings
  ): Promise<string | null> {
    try {
      const savedSettings =
        await updateSettings(newSettings);

      setSettings(savedSettings);

      showToast(
        "Settings saved successfully."
      );

      router.refresh();

      return null;
    } catch (error) {
      return error instanceof Error
        ? error.message
        : "Unable to save settings.";
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Settings
      </h1>

      <p className="mt-2 muted-text">
        Manage your account and workspace preferences.
      </p>

      <div className="mt-8">
        {isLoading && (
          <div className="card p-6">
            <p className="muted-text">
              Loading settings...
            </p>
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="card p-6">
            <p
              className="text-red-500"
              role="alert"
            >
              {errorMessage}
            </p>
          </div>
        )}

        {!isLoading &&
          !errorMessage &&
          settings && (
            <SettingsForm
              initialValues={settings}
              onSave={handleSave}
            />
          )}
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