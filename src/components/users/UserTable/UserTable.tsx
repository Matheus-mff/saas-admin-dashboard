import { Pencil, Trash2 } from "lucide-react";

import RowActionsMenu from "@/components/ui/RowActionsMenu/RowActionsMenu";
import SortableHeader from "@/components/ui/SortableHeader/SortableHeader";

import { SortDirection, UserSortField } from "@/types/sort";
import { User } from "@/types/user";

const PROTECTED_DEMO_EMAILS = ["admin@email.com", "manager@email.com", "user@email.com"];

type UserTableProps = {
  users: User[];
  sortField: UserSortField;
  sortDirection: SortDirection;
  canManage: boolean;
  onSort: (field: UserSortField) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export default function UserTable({
  users,
  sortField,
  sortDirection,
  canManage,
  onSort,
  onEdit,
  onDelete,
}: UserTableProps) {
  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] table-fixed border-collapse">
          <thead className="table-header">
            <tr>
              <SortableHeader
                label="ID"
                field="id"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                className={canManage ? "w-[8%]" : "w-[10%]"}
              />

              <SortableHeader
                label="Name"
                field="name"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                className={canManage ? "w-[22%]" : "w-[25%]"}
              />

              <SortableHeader
                label="Email"
                field="email"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                className={canManage ? "w-[35%]" : "w-[40%]"}
              />

              <SortableHeader
                label="Role"
                field="role"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                align="center"
                className={canManage ? "w-[17%]" : "w-[25%]"}
              />

              {canManage && <th className="w-[18%] px-6 py-3 text-center">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const isProtectedDemoAccount = PROTECTED_DEMO_EMAILS.includes(user.email);

              return (
                <tr key={user.id} className="table-row">
                  <td className="px-6 py-3.5 tabular-nums">{user.id}</td>

                  <td className="px-6 py-3.5">
                    <p className="truncate font-medium" title={user.name}>
                      {user.name}
                    </p>
                  </td>

                  <td className="px-6 py-3.5">
                    <p className="truncate muted-text" title={user.email}>
                      {user.email}
                    </p>
                  </td>

                  <td className="px-6 py-3.5 text-center">
                    <span className="role-badge">{user.role}</span>
                  </td>

                  {canManage && (
                    <td className="px-6 py-3.5 text-center">
                      <RowActionsMenu
                        label={`Actions for ${user.name}`}
                        actions={[
                          {
                            label: "Update",
                            icon: Pencil,
                            onClick: () => onEdit(user),
                            disabled: isProtectedDemoAccount,
                            title: isProtectedDemoAccount
                              ? "Demo accounts cannot be edited"
                              : `Edit ${user.name}`,
                          },
                          {
                            label: "Delete",
                            icon: Trash2,
                            onClick: () => onDelete(user),
                            tone: "danger",
                            disabled: isProtectedDemoAccount,
                            title: isProtectedDemoAccount
                              ? "Demo accounts cannot be deleted"
                              : `Delete ${user.name}`,
                          },
                        ]}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
