interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  message = "Bir şeyler ters gitti.",
  onRetry,
}: ErrorStateProps) => (
  <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
    <p className="text-sm font-medium">{message}</p>
    {onRetry ? (
      <button
        type="button"
        className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        onClick={onRetry}
      >
        Tekrar dene
      </button>
    ) : null}
  </div>
);

