import { SubscriptionStatus } from "@/constants/subscriptionStatuses";

import { Subscription, SubscriptionInput } from "@/types/subscription";

import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { notifyDashboardDataChanged } from "@/utils/dashboardEvents";

export async function getSubscriptions(): Promise<Subscription[]> {
  const response = await fetch("/api/subscriptions");

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to load subscriptions."));
  }

  return response.json();
}

export async function createSubscription(subscription: SubscriptionInput): Promise<Subscription> {
  const response = await fetch("/api/subscriptions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to create subscription."));
  }

  const newSubscription: Subscription = await response.json();

  notifyDashboardDataChanged();

  return newSubscription;
}

export async function updateSubscriptionStatus(
  id: number,
  status: SubscriptionStatus
): Promise<Subscription> {
  const response = await fetch(`/api/subscriptions/${id}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      status,
    }),
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to update subscription."));
  }
  const updatedSubscription: Subscription = await response.json();

  notifyDashboardDataChanged();

  return updatedSubscription;
}
