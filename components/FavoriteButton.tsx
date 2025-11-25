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

export const FavoriteButton = ({
  productId,
  summary,
  variant = "icon",
}: FavoriteButtonProps) => {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector(selectIsFavorite(productId));

  const label = isFavorite ? "Favorilerde" : "Favoriye ekle";

  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      aria-label={label}
      className={clsx(
        "flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
        variant === "icon"
          ? "size-11 border border-slate-200 bg-white text-slate-600 hover:text-brand"
          : "border border-brand bg-white px-4 py-2 text-sm text-brand hover:bg-brand hover:text-white",
        isFavorite && "bg-brand text-white hover:bg-brand-muted",
      )}
      onClick={() => dispatch(toggleFavorite(summary))}
    >
      <span aria-hidden className="text-lg">
        {isFavorite ? "♥" : "♡"}
      </span>
      {variant === "pill" ? <span>{label}</span> : null}
    </button>
  );
};

