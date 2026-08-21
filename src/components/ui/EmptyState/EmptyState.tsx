import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="state-panel px-6 py-14 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border bg-[var(--surface-secondary)]">
        <Inbox size={18} strokeWidth={1.7} className="muted-text" />
      </div>

      <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em]">{title}</h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 muted-text">{description}</p>
    </div>
  );
}
