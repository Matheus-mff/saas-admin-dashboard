export default function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard">
      <div className="skeleton-block h-9 w-44 rounded-md" />

      <div className="skeleton-block mt-3 h-4 w-80 max-w-full rounded" />

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="metric-card overflow-hidden">
            <div className="px-5 pb-5 pt-5">
              <div className="flex items-center justify-between gap-4">
                <div className="skeleton-block h-4 w-24 rounded" />
                <div className="skeleton-block h-2 w-2 rounded-full" />
              </div>

              <div className="skeleton-block mt-3 h-8 w-32 rounded-md" />
            </div>

            <div className="border-t bg-[var(--surface-secondary)]/40 px-5 py-3.5">
              <div className="skeleton-block h-3 w-40 max-w-full rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-5 p-6">
        <div className="skeleton-block h-5 w-36 rounded" />
        <div className="skeleton-block mt-3 h-4 w-72 max-w-full rounded" />
        <div className="skeleton-block mt-6 h-[320px] rounded-lg" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="card p-6">
            <div className="skeleton-block h-5 w-40 rounded" />
            <div className="skeleton-block mt-3 h-4 w-64 max-w-full rounded" />
            <div className="skeleton-block mt-6 h-[300px] rounded-lg" />
          </div>
        ))}
      </div>

      <div className="card mt-5 p-6">
        <div className="skeleton-block h-5 w-40 rounded" />
        <div className="skeleton-block mt-3 h-4 w-64 max-w-full rounded" />
        <div className="skeleton-block mt-6 h-[300px] rounded-lg" />
      </div>

      <div className="card mt-5 overflow-hidden">
        <div className="border-b px-6 py-4">
          <div className="skeleton-block h-5 w-40 rounded" />
          <div className="skeleton-block mt-2 h-4 w-64 max-w-full rounded" />
        </div>

        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="grid grid-cols-5 gap-5 border-t px-6 py-3.5 first:border-t-0">
            {Array.from({ length: 5 }).map((__, cellIndex) => (
              <div key={cellIndex} className="skeleton-block h-4 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
