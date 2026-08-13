import {
  User,
  UserInput,
} from "@/types/user";

import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

export async function getUsers(): Promise<User[]> {
  const response = await fetch(
    "/api/users",
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        "Unable to load users."
      )
    );
  }

  return response.json();
}

export async function createUser(
  user: UserInput
): Promise<User> {
  const response = await fetch(
    "/api/users",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(user),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        "Unable to create user."
      )
    );
  }

  return response.json();
}

export async function updateUser(
  id: number,
  user: UserInput
): Promise<User> {
  const response = await fetch(
    `/api/users/${id}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: user.name,
        email: user.email,
        role: user.role,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        "Unable to update user."
      )
    );
  }

  return response.json();
}

export async function deleteUser(
  id: number
): Promise<void> {
  const response = await fetch(
    `/api/users/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        "Unable to delete user."
      )
    );
  }
}