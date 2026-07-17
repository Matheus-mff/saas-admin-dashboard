"use client";

import SidebarItem from "./SidebarItem";
import { navigation } from "@/lib/navigation";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          SaaS Dashboard
        </h2>

        <p className="text-sm text-gray-500">
          Admin Panel
        </p>
      </div>
      
      <nav className="space-y-2">
        {navigation.map((link) => (
          <SidebarItem
            key={link.href}
            href={link.href}
            label={link.label}
            icon={link.icon}
          />
        ))}
      </nav>
    </aside>
  );
}