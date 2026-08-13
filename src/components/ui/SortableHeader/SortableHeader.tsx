import {
  ArrowDown,
  ArrowUp,
} from "lucide-react";

import {
  SortDirection,
  SortField,
} from "@/types/sort";

type SortableHeaderProps = {
  label: string;
  field: SortField;
  activeField: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
  align?: "left" | "center" | "right";
  className?: string;
};

export default function SortableHeader({
  label,
  field,
  activeField,
  direction,
  onSort,
  align = "left",
  className = "",
}: SortableHeaderProps) {
  const alignmentClass =
    align === "center"
      ? "text-center"
      : align === "right"
        ? "text-right"
        : "text-left";

  return (
    <th
      onClick={() => onSort(field)}
      className={`cursor-pointer select-none px-6 py-3 transition-colors hover:bg-[var(--hover)] ${alignmentClass} ${className}`}
    >
      <span className="inline-flex items-center gap-1 whitespace-nowrap">
        {label}

        {activeField === field &&
          (direction === "asc" ? (
            <ArrowUp size={16} />
          ) : (
            <ArrowDown size={16} />
          ))}
      </span>
    </th>
  );
}