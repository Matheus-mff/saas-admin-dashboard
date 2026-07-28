import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AppShell from "@/components/layout/AppShell/AppShell";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default async function AppLayout({
  children,
}: AppLayoutProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <AppShell
      user={{
        name: session.user.name ?? "Dashboard User",
        email: session.user.email ?? "",
        role: session.user.role,
      }}
    >
      {children}
    </AppShell>
  );
}