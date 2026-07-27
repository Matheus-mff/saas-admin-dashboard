export const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Completed",
] as const;

export type OrderStatus =
  (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_FILTERS = [
  "All",
  ...ORDER_STATUSES,
] as const;

export type OrderStatusFilter =
  (typeof ORDER_STATUS_FILTERS)[number];