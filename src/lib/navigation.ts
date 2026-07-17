import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/products",
    label: "Products",
    icon: Package,
  },
  {
    href: "/orders",
    label: "Orders",
    icon: ShoppingCart,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];