"use client";

import { useState, useEffect } from 'react';
import { useUsers } from "@/hooks/useUsers";
import { User } from "@/types/user";
import { SortDirection, SortField } from "@/types/sort";
import TableSkeleton from "@/components/ui/Skeleton/TableSkeleton";
import Pagination from "@/components/ui/Pagination/Pagination";
import Table from "@/components/ui/Table/Table";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import Button from "@/components/ui/Button/Button";
import Modal from "@/components/ui/Modal/Modal";
import UserForm from "@/components/forms/UserForm/UserForm";
import ConfirmModal from '@/components/ui/ConfirmModal/ConfirmModal';
import Toast from "@/components/ui/Toast/Toast";

const USERS_PER_PAGE = 2;

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [roleFilter, setRoleFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [userToDelete, setUserToDelete] = useState<User | undefined>();
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success")

  const {
    users,
    loading,
    error,
    retry,
    addUser,
    editUser,
    removeUser,
  } = useUsers();

  const filteredUsers = users.filter((user) => {
    const term = search.toLowerCase();

    const matchesSearch =
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term);

    const matchesRole = roleFilter === "All" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  })

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];

    if (valA < valB) {
      return sortDirection === "asc" ? -1 : 1;
    }

    if (valA > valB) {
      return sortDirection === "asc" ? 1 : -1;
    }

    return 0;
  })

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDirection(prev =>
        prev === "asc" ? "desc" : "asc"
      );
      return;
    }

    setSortField(field);
    setSortDirection("asc");
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [search])

  useEffect(() => {
    if (!toastMessage) return;

    const timeout = setTimeout(() => {
      setToastMessage("");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [toastMessage]);

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <ErrorState message={error} onRetry={retry} />
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

      <Button onClick={() => {
        setSelectedUser(undefined);
        setIsModalOpen(true);
      }}>
        Add User
      </Button>

      <div className="mt-8">

        <div className="mb-6 flex gap-2">
          {["All", "Admin", "Manager", "User"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`rounded-lg px-4 py-2 ${roleFilter === role ? "bg-blue-600 text-white" : "border"
                }`}
            >
              {role}
            </button>
          ))}

        </div>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-8 w-full rounded-lg border px-4 py-2"
        />

        {filteredUsers.length === 0 ? (
          <EmptyState title="No users found" description="Try another search term" />
        ) : (
          <>
            <Table
              users={paginatedUsers}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onEdit={(user) => {
                setSelectedUser(user);
                setIsModalOpen(true);
              }}
              onDelete={(user) => {
                setUserToDelete(user);
              }}
            />

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}
      </div>

      <Modal
        open={isModalOpen}
        title={selectedUser ? "Edit User" : "Add User"}
        onClose={() => setIsModalOpen(false)}
      >
        <UserForm
          user={selectedUser}
          onCancel={() => {
            setSelectedUser(undefined);
            setIsModalOpen(false);
          }}
          onSubmit={async (user) => {
            try {
              if (selectedUser) {
                await editUser(
                  selectedUser.id,
                  user
                );

                setToastType("success");
                setToastMessage(
                  "User updated successfully."
                );
              } else {
                await addUser(user);

                setToastType("success");
                setToastMessage(
                  "User created successfully."
                );
              }

              setSelectedUser(undefined);
              setIsModalOpen(false);
            } catch {
              setToastType("error");
              setToastMessage(
                "Something went wrong."
              );
            }
          }}
        />
      </Modal>

      <ConfirmModal
        open={!!userToDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.name}"?`}
        onCancel={() =>
          setUserToDelete(undefined)
        }
        onConfirm={async () => {
          if (!userToDelete) return;

          try {
            await removeUser(
              userToDelete.id
            );

            setToastType("success");
            setToastMessage(
              "User deleted successfully."
            );

            setUserToDelete(undefined);
          } catch {
            setToastType("error");
            setToastMessage(
              "Unable to delete user."
            );
          }
        }}
      />

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
        />
      )}
    </div>
  );
}