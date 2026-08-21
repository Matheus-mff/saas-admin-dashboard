import { Transaction } from "@/types/transaction";

import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch("/api/transactions");

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to load transactions."));
  }

  return response.json();
}
