export const SUBSCRIPTION_STATUSES = [
  "Active",
  "Trialing",
  "Canceled",
] as const;

export type SubscriptionStatus =
  (typeof SUBSCRIPTION_STATUSES)[number];

export const SUBSCRIPTION_STATUS_FILTERS = [
  "All",
  ...SUBSCRIPTION_STATUSES,
] as const;

export type SubscriptionStatusFilter =
  (typeof SUBSCRIPTION_STATUS_FILTERS)[number];