import { Notification } from "@/types/notification";

import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

type NotificationResponse = {
  notifications: Notification[];
  total: number;
};

export async function getNotifications(): Promise<NotificationResponse> {
  const response = await fetch(
    "/api/notifications"
  );

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        "Unable to load notifications."
      )
    );
  }

  return response.json();
}