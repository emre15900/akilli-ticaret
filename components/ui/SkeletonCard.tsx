import Skeleton from "react-loading-skeleton";

export const SkeletonCard = () => (
  <article className="flex h-full flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
    <Skeleton height={190} borderRadius="1rem" />
    <Skeleton height={18} width="80%" />
    <Skeleton height={14} width="60%" />
    <div className="mt-auto flex items-center justify-between">
      <Skeleton height={28} width="40%" />
      <Skeleton circle height={44} width={44} />
    </div>
  </article>
);

