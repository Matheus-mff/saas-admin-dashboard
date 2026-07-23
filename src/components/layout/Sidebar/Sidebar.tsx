import { X } from "lucide-react";

import SidebarItem from "./SidebarItem";
import { navigation } from "@/lib/navigation";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`navigation-surface fixed inset-y-0 left-0 z-50 w-64 border-r transition-transform duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <span className="text-xl font-bold">
            SaaS Admin
          </span>

          <button
            onClick={onClose}
            className="icon-button md:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li
                key={item.href}
                onClick={onClose}
              >
                <SidebarItem
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                />
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}