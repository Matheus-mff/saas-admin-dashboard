type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
};

export default function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="metric-card overflow-hidden">
      <div className="px-5 pb-5 pt-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium muted-text">{title}</p>
          <span className="metric-card-accent" aria-hidden="true" />
        </div>

        <h2 className="mt-2 text-[1.9rem] font-semibold leading-none tracking-[-0.045em] tabular-nums">
          {value}
        </h2>
      </div>

      <div className="border-t bg-[var(--surface-secondary)]/40 px-5 py-3.5">
        <p className="text-xs leading-5 muted-text">{description}</p>
      </div>
    </div>
  );
}
