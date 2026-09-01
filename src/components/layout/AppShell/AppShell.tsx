"use client";

import { useState } from "react";

import Header from "@/components/layout/Header/Header";
import Sidebar from "@/components/layout/Sidebar/Sidebar";

import { CurrentUser, CurrentUserProvider } from "@/contexts/CurrentUserContext";

type AppShellProps = {
  children: React.ReactNode;
  user: CurrentUser;
};

export default function AppShell({ children, user }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <CurrentUserProvider user={user}>
      <div className="app-surface min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onClose={() => setIsSidebarOpen(false)}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        <div
          className={`min-w-0 transition-[margin] duration-300 ${
            isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
          }`}
        >
          <Header user={user} onMenuClick={() => setIsSidebarOpen(true)} />

          <main className="mx-auto w-full max-w-[1720px] p-4 sm:p-7 lg:p-9 xl:p-10">
            {children}
          </main>
        </div>
      </div>
    </CurrentUserProvider>
  );
}
