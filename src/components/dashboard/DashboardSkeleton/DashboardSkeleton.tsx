export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-72 rounded bg-[var(--surface-secondary)]" />

      <div className="mt-3 h-5 w-56 rounded bg-[var(--surface-secondary)]" />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-xl bg-[var(--surface-secondary)]"
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="h-96 rounded-xl bg-[var(--surface-secondary)]" />
        <div className="h-96 rounded-xl bg-[var(--surface-secondary)]" />
      </div>

      <div className="mt-8 h-80 rounded-xl bg-[var(--surface-secondary)]" />
    </div>
  );
}