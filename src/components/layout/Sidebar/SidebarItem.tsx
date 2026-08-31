"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { LucideIcon } from "lucide-react";

type SidebarItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  isCollapsed: boolean;
};

export default function SidebarItem({ href, label, icon: Icon, isCollapsed }: SidebarItemProps) {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      aria-label={isCollapsed ? label : undefined}
      title={isCollapsed ? label : undefined}
      className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium ${
        isCollapsed ? "md:justify-center md:px-2" : ""
      } ${
        isActive
          ? "nav-item-active"
          : "text-[var(--muted-strong)] hover:bg-[var(--hover)] hover:text-[var(--foreground)]"
      }`}
    >
      <Icon size={18} strokeWidth={1.8} className="shrink-0" />

      <span className={`whitespace-nowrap ${isCollapsed ? "md:hidden" : ""}`}>{label}</span>
    </Link>
  );
}
