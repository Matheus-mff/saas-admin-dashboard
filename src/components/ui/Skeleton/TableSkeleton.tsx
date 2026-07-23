export default function TableSkeleton() {
  return (
    <div className="card animate-pulse p-6">
      <div className="mb-6 h-8 w-48 rounded bg-gray-200"></div>

      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="mb-4 flex items-center gap-6"
        >
          <div className="h-5 w-10 rounded bg-[var(--surface-secondary)]"></div>
          <div className="h-5 w-40 rounded bg-[var(--surface-secondary)]"></div>
          <div className="h-5 w-56 rounded bg-[var(--surface-secondary)]"></div>
          <div className="h-5 w-24 rounded bg-[var(--surface-secondary)]"></div>
        </div>
      ))}
    </div>
  );
}