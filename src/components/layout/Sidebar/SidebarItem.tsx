"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

type SidebarItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export default function SidebarItem({
  href,
  label,
  icon: Icon,
}: SidebarItemProps) {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-4 py-2 ${isActive
          ? "bg-blue-600 text-white"
          : "hover:bg-[var(--hover)]"
        }`}
    >
      <Icon size={20} />

      <span>{label}</span>
    </Link>
  );
}