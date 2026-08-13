"use client";

import { useState } from "react";

import UserForm from "@/components/forms/UserForm/UserForm";
import Button from "@/components/ui/Button/Button";
import ConfirmModal from "@/components/ui/ConfirmModal/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import Modal from "@/components/ui/Modal/Modal";
import Pagination from "@/components/ui/Pagination/Pagination";
import TableSkeleton from "@/components/ui/Skeleton/TableSkeleton";
import Table from "@/components/ui/Table/Table";
import Toast from "@/components/ui/Toast/Toast";

import {
  USER_ROLE_FILTERS,
  UserRoleFilter,
} from "@/constants/userRoles";

import { useCurrentUser } from "@/contexts/CurrentUserContext";

import { useToast } from "@/hooks/useToast";
import { useUsers } from "@/hooks/useUsers";

import {
  SortDirection,
  SortField,
} from "@/types/sort";

import { User } from "@/types/user";

const USERS_PER_PAGE = 10;

export default function UsersPage() {
  const { isAdmin } =
    useCurrentUser();

  const [search, setSearch] =
    useState("");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    sortField,
    setSortField,
  ] =
    useState<SortField>("name");

  const [
    sortDirection,
    setSortDirection,
  ] =
    useState<SortDirection>("asc");

  const [
    roleFilter,
    setRoleFilter,
  ] =
    useState<UserRoleFilter>("All");

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const [
    selectedUser,
    setSelectedUser,
  ] =
    useState<User | undefined>();

  const [
    userToDelete,
    setUserToDelete,
  ] =
    useState<User | undefined>();

  const {
    toastMessage,
    toastType,
    showToast,
  } = useToast();

  const {
    users,
    loading,
    error,
    retry,
    addUser,
    editUser,
    removeUser,
  } = useUsers();

  const normalizedSearch =
    search.trim().toLowerCase();

  const filteredUsers =
    users.filter((user) => {
      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(
            normalizedSearch
          ) ||
        user.email
          .toLowerCase()
          .includes(
            normalizedSearch
          ) ||
        user.role
          .toLowerCase()
          .includes(
            normalizedSearch
          );

      const matchesRole =
        roleFilter === "All" ||
        user.role === roleFilter;

      return (
        matchesSearch &&
        matchesRole
      );
    });

  const sortedUsers = [
    ...filteredUsers,
  ].sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];

    if (valueA < valueB) {
      return sortDirection ===
        "asc"
        ? -1
        : 1;
    }

    if (valueA > valueB) {
      return sortDirection ===
        "asc"
        ? 1
        : -1;
    }

    return 0;
  });

  const totalPages = Math.ceil(
    filteredUsers.length /
    USERS_PER_PAGE
  );

  const validCurrentPage =
    Math.min(
      currentPage,
      Math.max(totalPages, 1)
    );

  const startIndex =
    (validCurrentPage - 1) *
    USERS_PER_PAGE;

  const paginatedUsers =
    sortedUsers.slice(
      startIndex,
      startIndex +
      USERS_PER_PAGE
    );

  function handleSort(
    field: SortField
  ) {
    if (field === sortField) {
      setSortDirection(
        (previousDirection) =>
          previousDirection ===
            "asc"
            ? "desc"
            : "asc"
      );

      return;
    }

    setSortField(field);
    setSortDirection("asc");
  }

  function closeUserModal() {
    setSelectedUser(undefined);
    setIsModalOpen(false);
  }

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={retry}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Team
          </h1>

          <p className="mt-2 muted-text">
            {isAdmin
              ? "Manage members of your workspace."
              : "View members of your workspace."}
          </p>
        </div>

        {isAdmin && (
          <Button
            onClick={() => {
              setSelectedUser(
                undefined
              );

              setIsModalOpen(true);
            }}
          >
            Add Member
          </Button>
        )}
      </div>

      <div className="mt-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {USER_ROLE_FILTERS.map(
            (role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setRoleFilter(role);
                  setCurrentPage(1);
                }}
                className={
                  roleFilter === role
                    ? "primary-button"
                    : "secondary-button"
                }
              >
                {role}
              </button>
            )
          )}
        </div>

        <input
          type="search"
          placeholder="Search team members..."
          value={search}
          onChange={(event) => {
            setSearch(
              event.target.value
            );

            setCurrentPage(1);
          }}
          className="form-control"
        />

        <div className="mt-6">
          {filteredUsers.length ===
            0 ? (
            <EmptyState
              title="No members found"
              description="Try another search term or role."
            />
          ) : (
            <>
              <Table
                users={
                  paginatedUsers
                }
                sortField={
                  sortField
                }
                sortDirection={
                  sortDirection
                }
                canManage={
                  isAdmin
                }
                onSort={
                  handleSort
                }
                onEdit={(user) => {
                  setSelectedUser(
                    user
                  );

                  setIsModalOpen(
                    true
                  );
                }}
                onDelete={(user) => {
                  setUserToDelete(
                    user
                  );
                }}
              />

              {totalPages > 1 && (
                <Pagination
                  currentPage={
                    validCurrentPage
                  }
                  totalPages={
                    totalPages
                  }
                  onPageChange={
                    setCurrentPage
                  }
                />
              )}
            </>
          )}
        </div>
      </div>

      {isAdmin && (
        <>
          <Modal
            open={isModalOpen}
            title={
              selectedUser
                ? "Edit Member"
                : "Add Member"
            }
            onClose={
              closeUserModal
            }
          >
            <UserForm
              user={selectedUser}
              onCancel={
                closeUserModal
              }
              onSubmit={async (
                user
              ) => {
                try {
                  if (
                    selectedUser
                  ) {
                    await editUser(
                      selectedUser.id,
                      user
                    );

                    showToast(
                      "Member updated successfully."
                    );
                  } else {
                    await addUser(
                      user
                    );

                    showToast(
                      "Member created successfully."
                    );
                  }

                  closeUserModal();
                } catch (error) {
                  const message =
                    error instanceof
                      Error
                      ? error.message
                      : "Something went wrong.";

                  showToast(
                    message,
                    "error"
                  );
                }
              }}
            />
          </Modal>

          <ConfirmModal
            open={Boolean(
              userToDelete
            )}
            title="Delete Member"
            message={`Are you sure you want to delete "${userToDelete?.name}"?`}
            onCancel={() =>
              setUserToDelete(
                undefined
              )
            }
            onConfirm={async () => {
              if (!userToDelete) {
                return;
              }

              try {
                await removeUser(
                  userToDelete.id
                );

                showToast(
                  "Member deleted successfully."
                );

                setUserToDelete(
                  undefined
                );
              } catch (error) {
                const message =
                  error instanceof
                    Error
                    ? error.message
                    : "Unable to delete member.";

                showToast(
                  message,
                  "error"
                );
              }
            }}
          />
        </>
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
        />
      )}
    </div>
  );
}