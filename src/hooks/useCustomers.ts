import { useEffect, useState } from "react";

import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "@/services/customerService";

import { Customer, CustomerInput } from "@/types/customer";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCustomers() {
    try {
      setLoading(true);
      setError("");

      const data = await getCustomers();
      setCustomers(data);
    } catch {
      setError("Unable to load customers.");
    } finally {
      setLoading(false);
    }
  }

  async function addCustomer(customer: CustomerInput) {
    const newCustomer = await createCustomer(customer);

    setCustomers((prev) => [newCustomer, ...prev]);
  }

  async function editCustomer(id: number, customer: CustomerInput) {
    const updatedCustomer = await updateCustomer(id, customer);

    setCustomers((prev) =>
      prev.map((currentCustomer) =>
        currentCustomer.id === id ? updatedCustomer : currentCustomer
      )
    );
  }

  async function removeCustomer(id: number) {
    await deleteCustomer(id);

    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  }

  useEffect(() => {
    let cancelled = false;

    getCustomers()
      .then((data) => {
        if (cancelled) return;

        setCustomers(data);
      })
      .catch(() => {
        if (cancelled) return;

        setError("Unable to load customers.");
      })
      .finally(() => {
        if (cancelled) return;

        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    customers,
    loading,
    error,
    retry: loadCustomers,
    addCustomer,
    editCustomer,
    removeCustomer,
  };
}
