import { useEffect, useState } from "react";

import { getUsers } from "@/services/userService";
import { User } from "@/types/user";

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
        setError("Unable to load users.");

      } finally {
        setLoading(false);
      }
    }

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    setUsers,
    loading,
    error,
    retry: loadUsers,
  }
}