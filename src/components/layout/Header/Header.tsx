import { Bell, LogOut, Menu } from "lucide-react";
import { logout } from "@/app/(app)/actions";
import ThemeToggle from "@/components/ui/ThemeToggle/ThemeToggle";

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="navigation-surface flex h-16 items-center justify-between border-b px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
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

        <button
          className="icon-button"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            M
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium">
              Matheus
            </p>

            <p className="text-xs muted-text">
              Administrator
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