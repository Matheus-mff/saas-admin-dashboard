import {
  useEffect,
  useState,
} from "react";

import { SubscriptionStatus } from "@/constants/subscriptionStatuses";

import {
  getSubscriptions,
  updateSubscriptionStatus,
} from "@/services/subscriptionService";

import { Subscription } from "@/types/subscription";

export function useSubscriptions() {
  const [
    subscriptions,
    setSubscriptions,
  ] = useState<Subscription[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadSubscriptions() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getSubscriptions();

      setSubscriptions(data);
    } catch {
      setError(
        "Unable to load subscriptions."
      );
    } finally {
      setLoading(false);
    }
  }

  async function changeSubscriptionStatus(
    id: number,
    status: SubscriptionStatus
  ) {
    const updatedSubscription =
      await updateSubscriptionStatus(
        id,
        status
      );

    setSubscriptions(
      (previousSubscriptions) =>
        previousSubscriptions.map(
          (subscription) =>
            subscription.id === id
              ? updatedSubscription
              : subscription
        )
    );
  }

  useEffect(() => {
    let cancelled = false;

    getSubscriptions()
      .then((data) => {
        if (cancelled) return;

        setSubscriptions(data);
      })
      .catch(() => {
        if (cancelled) return;

        setError(
          "Unable to load subscriptions."
        );
      })
      .finally(() => {
        if (cancelled) return;

        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    subscriptions,
    loading,
    error,
    retry: loadSubscriptions,
    changeSubscriptionStatus,
  };
}