"use client";

import { LogOut, PanelLeftOpen } from "lucide-react";

import { usePathname } from "next/navigation";

import { logout } from "@/app/(app)/actions";

import { UserRole } from "@/constants/userRoles";

import NotificationBell from "@/components/ui/NotificationBell/NotificationBell";

import ThemeToggle from "@/components/ui/ThemeToggle/ThemeToggle";

type HeaderProps = {
  onMenuClick: () => void;

  user: {
    name: string;
    email: string;
    role: UserRole;
  };
};

const roleLabels: Record<UserRole, string> = {
  Admin: "Administrator",
  Manager: "Manager",
  User: "User",
};

const pageLabels: Record<string, string> = {
  "/dashboard": "Overview",
  "/users": "Team",
  "/customers": "Customers",
  "/plans": "Plans",
  "/subscriptions": "Subscriptions",
  "/transactions": "Transactions",
  "/settings": "Settings",
};

function getInitials(name: string) {
  const nameParts = name.trim().split(/\s+/).filter(Boolean);

  if (nameParts.length === 0) {
    return "U";
  }

  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
}

export default function Header({ onMenuClick, user }: HeaderProps) {
  const pathname = usePathname();

  const initials = getInitials(user.name);

  const roleLabel = roleLabels[user.role];

  const pageLabel = pageLabels[pathname] ?? "Overview";

  return (
    <header className="navigation-surface sticky top-0 z-30 flex h-[60px] items-center justify-between border-b px-5 sm:px-7 lg:px-9 xl:px-10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="icon-button md:hidden"
          aria-label="Open navigation"
        >
          <PanelLeftOpen size={19} strokeWidth={1.8} />
        </button>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Workspace</span>

          <span className="muted-text">/</span>

          <span className="muted-text">{pageLabel}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <ThemeToggle />

        <NotificationBell userKey={user.email} />

        <div className="mx-1 hidden h-6 w-px bg-[var(--border)] sm:block" />

        <div className="flex items-center gap-2.5">
          <div className="user-avatar">{initials}</div>

          <div className="hidden sm:block">
            <p className="max-w-40 truncate text-sm font-semibold leading-tight">{user.name}</p>

            <p className="mt-0.5 text-[11px] muted-text">{roleLabel}</p>
          </div>
        </div>

        <form action={logout}>
          <button type="submit" className="icon-button" aria-label="Logout" title="Logout">
            <LogOut size={18} strokeWidth={1.8} />
          </button>
        </form>
      </div>
    </header>
  );
}
