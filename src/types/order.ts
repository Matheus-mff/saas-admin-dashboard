export type Order = {
  id: number;
  customer: string;
  total: number;
  status: "Pending" | "Processing" | "Completed";
};