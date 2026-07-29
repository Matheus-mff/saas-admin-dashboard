import { redirect } from "next/navigation";

import { auth } from "@/auth";

import RegisterForm from "@/components/forms/RegisterForm/RegisterForm";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="app-surface flex min-h-screen items-center justify-center p-6">
      <RegisterForm />
    </main>
  );
}