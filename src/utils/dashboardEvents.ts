export const DASHBOARD_DATA_CHANGED =
  "dashboard-data-changed";

export function notifyDashboardDataChanged() {
  window.dispatchEvent(
    new Event(DASHBOARD_DATA_CHANGED)
  );
}