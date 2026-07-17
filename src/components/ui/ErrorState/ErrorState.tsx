type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export default function ErrorState({
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center">
      <div className="text-5xl">⚠️</div>

      <h2 className="mt-4 text-2xl font-semibold">
        Something went wrong
      </h2>

      <p className="mt-2 text-red-700">
        {message}
      </p>

      <button
        onClick={onRetry}
        className="mt-6 rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );
}