interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Yükleniyor..." }: LoadingStateProps) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
    <span className="size-10 animate-spin rounded-full border-4 border-brand/20 border-t-brand" aria-hidden />
    <p className="text-sm font-medium text-slate-600">{message}</p>
  </div>
);

