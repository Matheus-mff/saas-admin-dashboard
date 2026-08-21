import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { SortDirection } from "@/types/sort";

type SortableHeaderProps<TField extends string> = {
  label: string;
  field: TField;
  activeField: TField;
  direction: SortDirection;
  onSort: (field: TField) => void;
  align?: "left" | "center" | "right";
  className?: string;
};

export default function SortableHeader<TField extends string>({
  label,
  field,
  activeField,
  direction,
  onSort,
  align = "left",
  className = "",
}: SortableHeaderProps<TField>) {
  const alignmentClass =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";

  const isActive = activeField === field;

  const ariaSort = isActive ? (direction === "asc" ? "ascending" : "descending") : "none";

  return (
    <th className={`px-6 py-3 ${alignmentClass} ${className}`} aria-sort={ariaSort}>
      <button
        type="button"
        onClick={() => onSort(field)}
        title={`Sort by ${label}`}
        className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-sm transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
      >
        {label}

        {isActive ? (
          direction === "asc" ? (
            <ArrowUp size={13} strokeWidth={2} />
          ) : (
            <ArrowDown size={13} strokeWidth={2} />
          )
        ) : (
          <ArrowUpDown size={13} strokeWidth={1.8} className="muted-text" />
        )}
      </button>
    </th>
  );
}
