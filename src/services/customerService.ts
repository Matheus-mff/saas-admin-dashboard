import { Customer } from "@/types/customer";

import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch(
    "/api/customers"
  );

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        "Unable to load customers."
      )
    );
  }

  return response.json();
}