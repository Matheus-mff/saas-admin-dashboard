"use client";

import { useState, useEffect } from 'react';
import { getUsers } from "@/services/userService";
import { User } from "@/types/user";
import TableSkeleton from "@/components/ui/Skeleton/TableSkeleton";
import Pagination from "@/components/ui/Pagination/Pagination";
import Table from "@/components/ui/Table/Table";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import ErrorState from "@/components/ui/ErrorState/ErrorState";

const USERS_PER_PAGE = 2;

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredUsers = users.filter((user) => {
    const term = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  })

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [search])

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

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <ErrorState message={error} onRetry={loadUsers}/>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Users
      </h1>

      <p className="mt-2 text-gray-500">
        Manage all users in your application.
      </p>

      <div className="mt-8">

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-8 w-full rounded-lg border px-4 py-2"
        />

        {filteredUsers.length === 0 ? (
          <EmptyState title="No users found" description="Try another search term"/>
        ) : (
          <>
            <Table users={paginatedUsers}/>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
          </>
        )}
      </div>
    </div>
  );
}