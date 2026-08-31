import { SubscriptionStatus } from "@/constants/subscriptionStatuses";

export type Subscription = {
  id: number;
  status: SubscriptionStatus;
  startedAt: string;
  canceledAt: string | null;

  customer: {
    id: number;
    name: string;
    email: string;
    company: string | null;
  };

  plan: {
    id: number;
    name: string;
    monthlyPrice: number;
  };
};

export type CreatableSubscriptionStatus = Exclude<SubscriptionStatus, "Canceled">;

export type SubscriptionInput = {
  customerId: number;
  planId: number;
  status: CreatableSubscriptionStatus;
};
