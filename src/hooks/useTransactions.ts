import {
  useEffect,
  useState,
} from "react";

import { getTransactions } from "@/services/transactionService";

import { Transaction } from "@/types/transaction";

export function useTransactions() {
  const [
    transactions,
    setTransactions,
  ] = useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadTransactions() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getTransactions();

      setTransactions(data);
    } catch {
      setError(
        "Unable to load transactions."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    getTransactions()
      .then((data) => {
        if (cancelled) return;

        setTransactions(data);
      })
      .catch(() => {
        if (cancelled) return;

        setError(
          "Unable to load transactions."
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
    transactions,
    loading,
    error,
    retry: loadTransactions,
  };
}