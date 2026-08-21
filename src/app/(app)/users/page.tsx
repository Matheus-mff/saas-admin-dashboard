"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import UserForm from "@/components/forms/UserForm/UserForm";
import Button from "@/components/ui/Button/Button";
import ConfirmModal from "@/components/ui/ConfirmModal/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import Modal from "@/components/ui/Modal/Modal";
import Pagination from "@/components/ui/Pagination/Pagination";
import SearchInput from "@/components/ui/SearchInput/SearchInput";
import TableSkeleton from "@/components/ui/Skeleton/TableSkeleton";
import Toast from "@/components/ui/Toast/Toast";
import UserTable from "@/components/users/UserTable/UserTable";

import { USER_ROLE_FILTERS, UserRoleFilter } from "@/constants/userRoles";

import { useCurrentUser } from "@/contexts/CurrentUserContext";

import { useToast } from "@/hooks/useToast";
import { useUsers } from "@/hooks/useUsers";

import { SortDirection, UserSortField } from "@/types/sort";
import { User } from "@/types/user";

import { matchesSearch } from "@/utils/matchesSearch";

const USERS_PER_PAGE = 10;

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<UserSortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [userToDelete, setUserToDelete] = useState<User | undefined>();

  const { isAdmin } = useCurrentUser();

  const { toastMessage, toastType, showToast } = useToast();

  const { users, loading, error, retry, addUser, editUser, removeUser } = useUsers();

  const filteredUsers = users.filter((user) => {
    const matchesSearchTerm = matchesSearch(search, [user.name, user.email]);

    const matchesRole = roleFilter === "All" || user.role === roleFilter;

    return matchesSearchTerm && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];

    const comparison =
      typeof valueA === "number" && typeof valueB === "number"
        ? valueA - valueB
        : String(valueA).localeCompare(String(valueB));

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const validCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));

  const startIndex = (validCurrentPage - 1) * USERS_PER_PAGE;

  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  function handleSort(field: UserSortField) {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      setCurrentPage(1);

      return;
    }

    setSortField(field);
    setSortDirection("asc");
    setCurrentPage(1);
  }

  function closeUserModal() {
    setSelectedUser(undefined);
    setIsModalOpen(false);
  }

  if (loading) {
    return <TableSkeleton columns={isAdmin ? 5 : 4} showFilters showSearch showAction={isAdmin} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="page-title">Team</h1>

          <p className="page-description">
            {isAdmin ? "Manage members of your workspace." : "View members of your workspace."}
          </p>
        </div>

        {isAdmin && (
          <Button
            onClick={() => {
              setSelectedUser(undefined);

              setIsModalOpen(true);
            }}
          >
            <span className="inline-flex items-center gap-2">
              <Plus size={15} strokeWidth={2} />
              Add Member
            </span>
          </Button>
        )}
      </div>

      <div className="mt-7">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {USER_ROLE_FILTERS.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setRoleFilter(role);
                  setCurrentPage(1);
                }}
                className={`filter-chip ${roleFilter === role ? "filter-chip-active" : ""}`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="w-full lg:max-w-md">
            <SearchInput
              placeholder="Search team members..."
              value={search}
              onChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="mt-5">
          {filteredUsers.length === 0 ? (
            <EmptyState title="No members found" description="Try another search term or role." />
          ) : (
            <>
              <UserTable
                users={paginatedUsers}
                sortField={sortField}
                sortDirection={sortDirection}
                canManage={isAdmin}
                onSort={handleSort}
                onEdit={(user) => {
                  setSelectedUser(user);

                  setIsModalOpen(true);
                }}
                onDelete={(user) => {
                  setUserToDelete(user);
                }}
              />

              {totalPages > 1 && (
                <Pagination
                  currentPage={validCurrentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
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
            title={selectedUser ? "Edit Member" : "Add Member"}
            onClose={closeUserModal}
          >
            <UserForm
              user={selectedUser}
              onCancel={closeUserModal}
              onSubmit={async (user) => {
                try {
                  if (selectedUser) {
                    await editUser(selectedUser.id, user);

                    showToast("Member updated successfully.");
                  } else {
                    await addUser(user);

                    showToast("Member created successfully.");
                  }

                  closeUserModal();
                } catch (error) {
                  const message = error instanceof Error ? error.message : "Something went wrong.";

                  showToast(message, "error");
                }
              }}
            />
          </Modal>

          <ConfirmModal
            open={Boolean(userToDelete)}
            title="Delete Member"
            message={`Are you sure you want to delete "${userToDelete?.name}"?`}
            onCancel={() => setUserToDelete(undefined)}
            onConfirm={async () => {
              if (!userToDelete) {
                return;
              }

              try {
                await removeUser(userToDelete.id);

                showToast("Member deleted successfully.");

                setUserToDelete(undefined);
              } catch (error) {
                const message = error instanceof Error ? error.message : "Unable to delete member.";

                showToast(message, "error");
              }
            }}
          />
        </>
      )}

      {toastMessage && <Toast message={toastMessage} type={toastType} />}
    </div>
  );
}
