import { Bell, LogOut } from "lucide-react";
import { logout } from "@/app/(app)/actions";

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8">
      <div>
        <p className="text-sm text-gray-500">Admin Dashboard</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="rounded-lg p-2 transition hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            M
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium">Matheus</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg p-2 transition hover:bg-gray-100"
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}