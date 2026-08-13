import { SubscriptionStatus } from "@/constants/subscriptionStatuses";

export function getSubscriptionStatusClass(
  status: SubscriptionStatus
) {
  switch (status) {
    case "Active":
      return "status-active";

    case "Trialing":
      return "status-trialing";

    case "Canceled":
      return "status-canceled";
  }
}