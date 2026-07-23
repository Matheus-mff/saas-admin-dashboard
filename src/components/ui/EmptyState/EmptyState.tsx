type EmptyStateProps = {
  title: string;
  description: string;
};

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="card p-12 text-center">
      <div className="text-5xl">📭</div>

      <h2 className="mt-6 text-2xl font-semibold">
        {title}
      </h2>

      <p className="mt-3 muted-text">
        {description}
      </p>
    </div>
  );
}