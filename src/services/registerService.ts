import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export type RegisterInput = {
  name: string;
  email: string;
  workspaceName: string;
  password: string;
  confirmPassword: string;
};

export async function registerAccount(account: RegisterInput): Promise<void> {
  const response = await fetch("/api/register", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(account),
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, "Unable to create account."));
  }
}
