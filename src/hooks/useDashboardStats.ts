import { useEffect, useState } from "react";

import { getDashboardData } from "@/services/dashboardService";
import { DashboardData } from "@/types/dashboard";

export function useDashboardStats() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const dashboardData = await getDashboardData();

      setData(dashboardData);
    } catch {
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    getDashboardData()
      .then((dashboardData) => {
        if (cancelled) return;

        setData(dashboardData);
      })
      .catch(() => {
        if (cancelled) return;

        setError("Unable to load dashboard data.");
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
    data,
    loading,
    error,
    retry: loadDashboard,
  };
}
