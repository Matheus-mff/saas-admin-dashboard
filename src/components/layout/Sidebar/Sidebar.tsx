import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import SidebarItem from "./SidebarItem";

import { navigation } from "@/lib/navigation";

type SidebarProps = {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
};

export default function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/55 md:hidden"
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`navigation-surface fixed inset-y-0 left-0 z-50 flex w-64 max-w-[calc(100vw-2rem)] flex-col overflow-hidden border-r transition-[transform,width] duration-300 md:max-w-none md:translate-x-0 ${
          isCollapsed ? "md:w-20" : "md:w-64"
        } ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className={`flex h-[60px] items-center justify-between border-b ${
            isCollapsed ? "px-5 md:px-2" : "px-5"
          }`}
        >
          <div className={`flex items-center gap-3 ${isCollapsed ? "md:gap-0" : ""}`}>
            <div className="brand-mark">SA</div>

            <span
              className={`whitespace-nowrap text-[15px] font-bold tracking-[-0.025em] ${
                isCollapsed ? "md:hidden" : ""
              }`}
            >
              SaaS Admin
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="icon-button hidden md:inline-flex"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={18} strokeWidth={1.8} />
            ) : (
              <PanelLeftClose size={18} strokeWidth={1.8} />
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="icon-button md:hidden"
            aria-label="Close navigation"
            title="Close navigation"
          >
            <PanelLeftClose size={18} strokeWidth={1.8} />
          </button>
        </div>

        <nav className={`flex-1 overflow-y-auto ${isCollapsed ? "p-3 md:px-3" : "p-3"}`}>
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.href} onClick={onClose}>
                <SidebarItem
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  isCollapsed={isCollapsed}
                />
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
