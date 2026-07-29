"use client";

import { useState } from "react";

import Header from "@/components/layout/Header/Header";
import Sidebar from "@/components/layout/Sidebar/Sidebar";

import {
  CurrentUser,
  CurrentUserProvider,
} from "@/contexts/CurrentUserContext";

type AppShellProps = {
  children: React.ReactNode;
  user: CurrentUser;
};

export default function AppShell({
  children,
  user,
}: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  return (
    <CurrentUserProvider user={user}>
      <div className="app-surface min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() =>
            setIsSidebarOpen(false)
          }
        />

        <div className="md:ml-64">
          <Header
            user={user}
            onMenuClick={() =>
              setIsSidebarOpen(true)
            }
          />

          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </CurrentUserProvider>
  );
}