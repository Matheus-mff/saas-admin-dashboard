import { Plan, PlanInput } from "@/types/plan";

import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { notifyDashboardDataChanged } from "@/utils/dashboardEvents";

export async function getPlans(): Promise<Plan[]> {
  const response = await fetch("/api/plans");

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to load plans."));
  }

  return response.json();
}

export async function createPlan(plan: PlanInput): Promise<Plan> {
  const response = await fetch("/api/plans", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(plan),
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to create plan."));
  }

  const newPlan: Plan = await response.json();

  notifyDashboardDataChanged();

  return newPlan;
}

export async function updatePlan(id: number, plan: PlanInput): Promise<Plan> {
  const response = await fetch(`/api/plans/${id}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(plan),
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to update plan."));
  }

  const updatedPlan: Plan = await response.json();

  notifyDashboardDataChanged();

  return updatedPlan;
}
