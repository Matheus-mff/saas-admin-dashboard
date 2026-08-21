export const TRANSACTION_STATUSES = ["Pending", "Paid", "Failed", "Refunded"] as const;

export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

export const TRANSACTION_STATUS_FILTERS = ["All", ...TRANSACTION_STATUSES] as const;

export type TransactionStatusFilter = (typeof TRANSACTION_STATUS_FILTERS)[number];
