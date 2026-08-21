import { useEffect, useState } from "react";

import { createPlan, getPlans, updatePlan } from "@/services/planService";
import { Plan, PlanInput } from "@/types/plan";

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPlans() {
    try {
      setLoading(true);
      setError("");

      const data = await getPlans();

      setPlans(data);
    } catch {
      setError("Unable to load plans.");
    } finally {
      setLoading(false);
    }
  }

  async function addPlan(plan: PlanInput) {
    const newPlan = await createPlan(plan);

    setPlans((prev) => [...prev, newPlan].sort((a, b) => a.monthlyPrice - b.monthlyPrice));
  }

  async function editPlan(id: number, plan: PlanInput) {
    const updatedPlan = await updatePlan(id, plan);

    setPlans((prev) =>
      prev
        .map((currentPlan) => (currentPlan.id === id ? updatedPlan : currentPlan))
        .sort((a, b) => a.monthlyPrice - b.monthlyPrice)
    );
  }

  useEffect(() => {
    let cancelled = false;

    getPlans()
      .then((data) => {
        if (cancelled) return;

        setPlans(data);
      })
      .catch(() => {
        if (cancelled) return;

        setError("Unable to load plans.");
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
    plans,
    loading,
    error,
    retry: loadPlans,
    addPlan,
    editPlan,
  };
}
