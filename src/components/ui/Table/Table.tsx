import { User } from "@/types/user";
import { SortDirection, SortField } from "@/types/sort";
import SortableHeader from "../SortableHeader/SortableHeader";

type TableProps = {
  users: User[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
};

export default function Table({ users, sortField, sortDirection, onSort }: TableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
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
            
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-t hover:bg-gray-50"
            >
              <td className="px-6 py-4">{user.id}</td>
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                {user.role}
                </span>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}