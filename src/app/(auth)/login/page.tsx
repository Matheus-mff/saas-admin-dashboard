import { redirect } from "next/navigation";

import { auth } from "@/auth";

import LoginForm from "@/components/forms/LoginForm/LoginForm";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="auth-shell flex min-h-screen items-center justify-center p-5 sm:p-8">
      <LoginForm />
    </main>
  );
}
