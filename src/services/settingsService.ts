import { Settings, SettingsInput } from "@/types/settings";

import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export async function getSettings(): Promise<Settings> {
  const response = await fetch("/api/settings", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to load settings."));
  }

  return response.json();
}

export async function updateSettings(settings: SettingsInput): Promise<Settings> {
  const response = await fetch("/api/settings", {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to save settings."));
  }

  return response.json();
}
