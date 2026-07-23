import { User } from "@/types/user";
import { SortDirection, SortField } from "@/types/sort";
import SortableHeader from "@/components/ui/SortableHeader/SortableHeader";
import { Pencil, Trash2 } from "lucide-react";

type TableProps = {
  users: User[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export default function Table({
  users,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
}: TableProps) {
  return (
    <div className="table-container">
      <table className="w-full border-collapse">
        <thead className="table-header">
          <tr>
            <th className="px-6 py-3 text-left">ID</th>

            <SortableHeader
              label="Name"
              field="name"
              activeField={sortField}
              direction={sortDirection}
              onSort={onSort}
            />

            <SortableHeader
              label="Email"
              field="email"
              activeField={sortField}
              direction={sortDirection}
              onSort={onSort}
            />

            <SortableHeader
              label="Role"
              field="role"
              activeField={sortField}
              direction={sortDirection}
              onSort={onSort}
            />

            {/* New column */}
            <th className="px-6 py-3 text-left">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="table-row"
            >
              <td className="px-6 py-4">{user.id}</td>

              <td className="px-6 py-4">
                {user.name}
              </td>

              <td className="px-6 py-4">
                {user.email}
              </td>

              <td className="px-6 py-4">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  {user.role}
                </span>
              </td>

              {/* New column */}
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="icon-button"
                    aria-label="Edit user"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(user)}
                    className="icon-button danger-icon-button"
                    aria-label="Delete user"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}