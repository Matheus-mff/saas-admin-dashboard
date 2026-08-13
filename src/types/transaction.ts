import { TransactionStatus } from "@/constants/transactionStatuses";

export type Transaction = {
  id: number;
  amount: number;
  status: TransactionStatus;
  paidAt: string | null;
  createdAt: string;

  subscription: {
    id: number;

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
};