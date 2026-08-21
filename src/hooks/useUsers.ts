import { useEffect, useState } from "react";

import { createUser, deleteUser, getUsers, updateUser } from "@/services/userService";

import { User, UserInput } from "@/types/user";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();

      setUsers(data);
    } catch {
      setError("Unable to load members.");
    } finally {
      setLoading(false);
    }
  }

  async function addUser(user: UserInput) {
    const newUser = await createUser(user);

    setUsers((prev) => [newUser, ...prev]);

    return newUser;
  }

  async function editUser(id: number, user: UserInput) {
    const updatedUser = await updateUser(id, user);

    setUsers((prev) =>
      prev.map((currentUser) => (currentUser.id === id ? updatedUser : currentUser))
    );

    return updatedUser;
  }

  async function removeUser(id: number) {
    await deleteUser(id);

    setUsers((prev) => prev.filter((user) => user.id !== id));
  }

  useEffect(() => {
    let cancelled = false;

    getUsers()
      .then((data) => {
        if (cancelled) return;

        setUsers(data);
      })
      .catch(() => {
        if (cancelled) return;

        setError("Unable to load members.");
      })
      .finally(() => {
        if (cancelled) return;

        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    users,
    loading,
    error,
    retry: loadUsers,
    addUser,
    editUser,
    removeUser,
  };
}
