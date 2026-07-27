import { OrderStatus } from "@/constants/orderStatuses";

export type Order = {
  id: number;
  customer: string;
  total: number;
  status: OrderStatus;
};