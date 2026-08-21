export type NotificationType = "failed-payment" | "pending-payment" | "trial-subscription";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  href: "/transactions" | "/subscriptions";
};
