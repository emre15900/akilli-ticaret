"use client";

import clsx from "clsx";
import type { FavoriteProductSummary } from "@/types/product";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectIsFavorite, toggleFavorite } from "@/store/favoritesSlice";

interface FavoriteButtonProps {
  productId: number;
  summary: FavoriteProductSummary;
  variant?: "icon" | "pill";
}

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={clsx(
      "size-4 transition-transform duration-200",
      filled ? "scale-110" : "scale-100",
    )}
  >
    <path
      d="M12 21s-7.2-4.35-9.6-9.22c-1.28-2.67-.09-6 2.88-6.69a4.2 4.2 0 0 1 4.35 1.77c1.65-2.4 5.58-2.4 7.23 0a4.2 4.2 0 0 1 4.35-1.77c2.97.69 4.16 4.02 2.88 6.69C19.2 16.65 12 21 12 21Z"
      className={filled ? "fill-current" : "fill-transparent stroke-current"}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FavoriteButton = ({
  productId,
  summary,
  variant = "icon",
}: FavoriteButtonProps) => {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector(selectIsFavorite(productId));

  const label = isFavorite ? "Favorilerde" : "Favoriye ekle";

  const variantClasses =
    variant === "icon"
      ? "h-11 w-11"
      : "px-5 py-2 text-sm font-semibold tracking-tight";

  const idlePalette =
    variant === "icon"
      ? "border border-slate-200 bg-white text-slate-600 hover:border-rose-300 hover:text-rose-600 shadow-sm"
      : "border border-slate-200 bg-white text-slate-600 hover:border-rose-300 hover:text-rose-600";

  const activePalette =
    variant === "icon"
      ? "border-transparent bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xl shadow-rose-200"
      : "border-transparent bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-200";

  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      aria-label={label}
      aria-live="polite"
      className={clsx(
        "group relative overflow-hidden rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500",
        variantClasses,
        isFavorite ? activePalette : idlePalette,
      )}
      onClick={() => dispatch(toggleFavorite(summary))}
    >
      <span className="flex items-center justify-center gap-2 transition-transform duration-200 group-active:scale-95">
        <HeartIcon filled={isFavorite} />
        {variant === "pill" ? <span className="font-semibold">{label}</span> : null}
      </span>
    </button>
  );
};

