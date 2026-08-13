import {
  useEffect,
  useState,
} from "react";

import { getCustomers } from "@/services/customerService";

import { Customer } from "@/types/customer";

export function useCustomers() {
  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadCustomers() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getCustomers();

      setCustomers(data);
    } catch {
      setError(
        "Unable to load customers."
      );
    } finally {
      setLoading(false);
    }
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

        setError(
          "Unable to load customers."
        );
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
  };
}