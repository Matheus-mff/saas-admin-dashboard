"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import ChangePasswordForm from "@/components/forms/ChangePasswordForm/ChangePasswordForm";
import SettingsForm from "@/components/forms/SettingsForm/SettingsForm";
import SettingsSkeleton from "@/components/settings/SettingsSkeleton/SettingsSkeleton";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import Toast from "@/components/ui/Toast/Toast";

import { useCurrentUser } from "@/contexts/CurrentUserContext";
import { useToast } from "@/hooks/useToast";
import { getSettings, updateSettings } from "@/services/settingsService";
import { Settings } from "@/types/settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const { user, isAdmin } = useCurrentUser();

  const isProtectedDemoAccount = [
    "admin@email.com",
    "manager@email.com",
    "user@email.com",
  ].includes(user.email);

  const { toastMessage, toastType, showToast } = useToast();

  useEffect(() => {
    let isCancelled = false;

    async function loadInitialSettings() {
      try {
        const loadedSettings = await getSettings();

        if (!isCancelled) {
          setSettings(loadedSettings);
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to load settings.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialSettings();

    return () => {
      isCancelled = true;
    };
  }, []);

  async function retryLoading() {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const loadedSettings = await getSettings();

      setSettings(loadedSettings);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load settings.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(newSettings: Settings): Promise<string | null> {
    try {
      const savedSettings = await updateSettings({
        name: newSettings.name,
        email: newSettings.email,

        ...(isAdmin && {
          workspaceName: newSettings.workspaceName,
        }),
      });

      setSettings(savedSettings);

      showToast("Settings saved successfully.");

      router.refresh();

      return null;
    } catch (error) {
      return error instanceof Error ? error.message : "Unable to save settings.";
    }
  }

  return (
    <div>
      <h1 className="page-title">Settings</h1>

      <p className="page-description">Manage your account and workspace preferences.</p>

      <div className="mt-7">
        {isLoading && <SettingsSkeleton />}

        {!isLoading && errorMessage && <ErrorState message={errorMessage} onRetry={retryLoading} />}

        {!isLoading && !errorMessage && settings && (
          <div className="space-y-5">
            <SettingsForm
              initialValues={settings}
              canManageWorkspace={isAdmin}
              isProfileLocked={isProtectedDemoAccount}
              onSave={handleSave}
            />

            <ChangePasswordForm
              onSuccess={showToast}
              isDisabled={isProtectedDemoAccount}
            />
          </div>
        )}
      </div>

      {toastMessage && <Toast message={toastMessage} type={toastType} />}
    </div>
  );
}
