"use client";

import clsx from "clsx";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import type { FavoriteProductSummary } from "@/types/product";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectIsFavorite, toggleFavorite } from "@/store/favoritesSlice";

interface FavoriteButtonProps {
  productId: number;
  summary: FavoriteProductSummary;
  variant?: "icon" | "pill";
  className?: string;
}

export const FavoriteButton = ({
  productId,
  summary,
  variant = "icon",
  className,
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
        className,
      )}
      onClick={() => {
        dispatch(toggleFavorite(summary));
        toast[isFavorite ? "info" : "success"](
          isFavorite ? "Favorilerden çıkarıldı" : "Favorilere eklendi",
          {
            position: "top-right",
            hideProgressBar: false,
            pauseOnHover: true,
          },
        );
      }}
    >
      <span className="flex items-center justify-center gap-2 transition-transform duration-200 group-active:scale-95">
        {isFavorite ? (
          <FaHeart className="text-lg" />
        ) : (
          <FaRegHeart className="text-lg" />
        )}
        {variant === "pill" ? <span className="font-semibold">{label}</span> : null}
      </span>
    </button>
  );
};

