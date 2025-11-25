export const SkeletonCard = () => (
  <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
    <div className="h-48 w-full animate-pulse rounded-xl bg-slate-100" />
    <div className="h-5 w-3/4 animate-pulse rounded-full bg-slate-100" />
    <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-100" />
    <div className="mt-auto flex items-center justify-between">
      <div className="h-6 w-1/3 animate-pulse rounded-full bg-slate-100" />
      <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" />
    </div>
  </div>
);

