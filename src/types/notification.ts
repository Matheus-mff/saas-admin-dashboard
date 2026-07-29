export type NotificationType =
  | "out-of-stock"
  | "low-stock"
  | "pending-order";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  href: "/products" | "/orders";
};