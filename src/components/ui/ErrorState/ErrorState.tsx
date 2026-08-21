import { TriangleAlert } from "lucide-react";

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="state-panel error-panel px-6 py-14 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--danger-border)] bg-[var(--danger-soft)] text-[var(--danger)]">
        <TriangleAlert size={18} strokeWidth={1.8} />
      </div>

      <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em]">Something went wrong</h2>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--danger)]">{message}</p>

      <button onClick={onRetry} className="primary-button mt-6">
        Retry
      </button>
    </div>
  );
}
