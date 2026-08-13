import {
  Pencil,
  Trash2,
} from "lucide-react";

import SortableHeader from "@/components/ui/SortableHeader/SortableHeader";

import {
  SortDirection,
  SortField,
} from "@/types/sort";

import { User } from "@/types/user";

type TableProps = {
  users: User[];
  sortField: SortField;
  sortDirection: SortDirection;
  canManage: boolean;
  onSort: (field: SortField) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export default function Table({
  users,
  sortField,
  sortDirection,
  canManage,
  onSort,
  onEdit,
  onDelete,
}: TableProps) {
  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] table-fixed border-collapse">
          <thead className="table-header">
            <tr>
              <th
                className={`px-6 py-3 text-left ${canManage
                    ? "w-[8%]"
                    : "w-[10%]"
                  }`}
              >
                ID
              </th>

              <SortableHeader
                label="Name"
                field="name"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                className={
                  canManage
                    ? "w-[22%]"
                    : "w-[25%]"
                }
              />

              <SortableHeader
                label="Email"
                field="email"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                className={
                  canManage
                    ? "w-[35%]"
                    : "w-[40%]"
                }
              />

              <SortableHeader
                label="Role"
                field="role"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
                align="center"
                className={
                  canManage
                    ? "w-[17%]"
                    : "w-[25%]"
                }
              />

              {canManage && (
                <th className="w-[18%] px-6 py-3 text-center">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="table-row"
              >
                <td className="px-6 py-4 tabular-nums">
                  {user.id}
                </td>

                <td className="px-6 py-4">
                  {user.name}
                </td>

                <td className="px-6 py-4">
                  {user.email}
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="role-badge">
                    {user.role}
                  </span>
                </td>

                {canManage && (
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(user)
                        }
                        className="icon-button"
                        aria-label={`Edit ${user.name}`}
                      >
                        <Pencil
                          size={18}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(user)
                        }
                        className="icon-button danger-icon-button"
                        aria-label={`Delete ${user.name}`}
                      >
                        <Trash2
                          size={18}
                        />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}