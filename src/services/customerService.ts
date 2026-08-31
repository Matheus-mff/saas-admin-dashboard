import { Customer, CustomerInput } from "@/types/customer";

import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { notifyDashboardDataChanged } from "@/utils/dashboardEvents";

export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch("/api/customers");

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to load customers."));
  }

  return response.json();
}

export async function createCustomer(customer: CustomerInput): Promise<Customer> {
  const response = await fetch("/api/customers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to create customer."));
  }

  const newCustomer: Customer = await response.json();

  notifyDashboardDataChanged();

  return newCustomer;
}

export async function updateCustomer(id: number, customer: CustomerInput): Promise<Customer> {
  const response = await fetch(`/api/customers/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to update customer."));
  }

  const updatedCustomer: Customer = await response.json();

  notifyDashboardDataChanged();

  return updatedCustomer;
}

export async function deleteCustomer(id: number): Promise<void> {
  const response = await fetch(`/api/customers/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to delete customer."));
  }

  notifyDashboardDataChanged();
}
