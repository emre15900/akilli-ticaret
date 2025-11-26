interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Yükleniyor..." }: LoadingStateProps) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <span className="size-10 animate-spin rounded-full border-4 border-brand/20 border-t-brand dark:border-brand/30" aria-hidden />
    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{message}</p>
  </div>
);

