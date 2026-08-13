import {
  CreditCard,
  LayoutDashboard,
  ReceiptText,
  Settings,
  Users,
  UsersRound,
  WalletCards,
} from "lucide-react";

export const navigation = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/users",
    label: "Team",
    icon: Users,
  },
  {
    href: "/customers",
    label: "Customers",
    icon: UsersRound,
  },
  {
    href: "/plans",
    label: "Plans",
    icon: WalletCards,
  },
  {
    href: "/subscriptions",
    label: "Subscriptions",
    icon: CreditCard,
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: ReceiptText,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];