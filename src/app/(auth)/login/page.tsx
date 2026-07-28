import { redirect } from "next/navigation";

import { auth } from "@/auth";

import LoginForm from "@/components/forms/LoginForm/LoginForm";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="app-surface flex min-h-screen items-center justify-center p-6">
      <LoginForm />
    </main>
  );
}