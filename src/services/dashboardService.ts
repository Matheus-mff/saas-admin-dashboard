import { DashboardData } from "@/types/dashboard";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export async function getDashboardData(): Promise<DashboardData> {
  const response = await fetch("/api/dashboard", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Unable to load dashboard data."
    );

    throw new Error(message);
  }

  return response.json();
}