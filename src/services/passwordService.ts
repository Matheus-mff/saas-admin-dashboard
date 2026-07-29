import { ChangePasswordInput } from "@/types/password";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export async function changePassword(
  passwords: ChangePasswordInput
): Promise<void> {
  const response = await fetch(
    "/api/settings/password",
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(passwords),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        "Unable to change password."
      )
    );
  }
}