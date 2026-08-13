import { SubscriptionStatus } from "@/constants/subscriptionStatuses";

export type CustomerSubscription = {
  id: number;
  status: SubscriptionStatus;
  startedAt: string;

  plan: {
    id: number;
    name: string;
    monthlyPrice: number;
  };
};

export type Customer = {
  id: number;
  name: string;
  email: string;
  company: string | null;
  createdAt: string;
  latestSubscription: CustomerSubscription | null;
};