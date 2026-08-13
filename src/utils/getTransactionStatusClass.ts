import { TransactionStatus } from "@/constants/transactionStatuses";

export function getTransactionStatusClass(
  status: TransactionStatus
) {
  switch (status) {
    case "Paid":
      return "status-paid";

    case "Pending":
      return "status-pending";

    case "Failed":
      return "status-failed";

    case "Refunded":
      return "status-refunded";
  }
}