type TableSkeletonProps = {
  columns: 3 | 4 | 5 | 6;
  rows?: number;
  showFilters?: boolean;
  filterCount?: number;
  showSearch?: boolean;
  showAction?: boolean;
};

const gridColumns: Record<TableSkeletonProps["columns"], string> = {
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

export default function TableSkeleton({
  columns,
  rows = 5,
  showFilters = false,
  filterCount = 4,
  showSearch = false,
  showAction = false,
}: TableSkeletonProps) {
  const gridClass = gridColumns[columns];

  return (
    <div aria-busy="true" aria-label="Loading page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="skeleton-block h-9 w-40 rounded-md" />

          <div className="skeleton-block mt-3 h-4 w-72 max-w-full rounded" />
        </div>

        {showAction && <div className="skeleton-block h-10 w-28 rounded-lg" />}
      </div>

      {(showFilters || showSearch) && (
        <div className="mt-7 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {showFilters && (
            <div className="flex flex-wrap gap-2">
              {Array.from({
                length: filterCount,
              }).map((_, index) => (
                <div key={index} className="skeleton-block h-9 w-20 rounded-md" />
              ))}
            </div>
          )}

          {showSearch && (
            <div className="w-full lg:max-w-md">
              <div className="skeleton-block h-[42px] rounded-lg" />
            </div>
          )}
        </div>
      )}

      <div
        className={`table-container overflow-x-auto ${showFilters || showSearch ? "mt-5" : "mt-7"}`}
      >
        <div className="min-w-[760px]">
          <div className={`grid ${gridClass} gap-6 border-b px-6 py-3`}>
            {Array.from({
              length: columns,
            }).map((_, index) => (
              <div key={index} className="skeleton-block h-3 rounded" />
            ))}
          </div>

          {Array.from({
            length: rows,
          }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className={`grid ${gridClass} gap-6 border-t px-6 py-3.5 first:border-t-0`}
            >
              {Array.from({
                length: columns,
              }).map((_, columnIndex) => (
                <div key={columnIndex} className="skeleton-block h-4 rounded" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
