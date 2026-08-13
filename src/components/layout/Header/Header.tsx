import {
  LogOut,
  Menu,
} from "lucide-react";

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

const roleLabels: Record<
  UserRole,
  string
> = {
  Admin: "Administrator",
  Manager: "Manager",
  User: "User",
};

function getInitials(name: string) {
  const nameParts = name.trim().split(/\s+/).filter(Boolean);

  if (nameParts.length === 0) {
    return "U";
  }

  if (nameParts.length === 1) {
    return nameParts[0]
      .charAt(0)
      .toUpperCase();
  }

  return (
    nameParts[0].charAt(0) +
    nameParts[
      nameParts.length - 1
    ].charAt(0)
  ).toUpperCase();
}

export default function Header({
  onMenuClick,
  user,
}: HeaderProps) {
  const initials = getInitials(
    user.name
  );

  const roleLabel = roleLabels[user.role];

  return (
    <header className="navigation-surface flex h-16 items-center justify-between border-b px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="icon-button md:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <p className="text-sm muted-text">
          Admin Dashboard
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />

        <NotificationBell />

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            {initials}
          </div>

          <div className="hidden sm:block">
            <p className="max-w-40 truncate text-sm font-medium">
              {user.name}
            </p>

            <p className="text-xs muted-text">
              {roleLabel}
            </p>
          </div>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="icon-button"
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        </form>
      </div>
    </header>
  );
}