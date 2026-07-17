import { ArrowDown, ArrowUp } from "lucide-react";
import { SortDirection, SortField } from "@/types/sort";

type SortableHeaderProps = {
  label: string;
  field: SortField;
  activeField: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
};

export default function SortableHeader({
  label,
  field,
  activeField,
  direction,
  onSort,
}: SortableHeaderProps) {
  return (
    <th
      onClick={() => onSort(field)}
      className="cursor-pointer select-none px-6 py-3 text-left transition-colors hover:bg-gray-100"
    >
      {label}

      {activeField === field &&
        (direction === "asc" ? (
          <ArrowUp size={16} className="ml-1 inline" />
        ) : (
          <ArrowDown size={16} className="ml-1 inline" />
        ))}
    </th>
  );
}