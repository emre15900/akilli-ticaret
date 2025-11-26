"use client";

import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { useAppSelector } from "@/store/hooks";
import { selectFavoriteSummaries } from "@/store/favoritesSlice";
import { EmptyState } from "@/components/ui/EmptyState";
import { FavoriteButton } from "@/components/FavoriteButton";
import { normalizeCurrency } from "@/utils/currency";

export default function FavoritesPage() {
  const favorites = useAppSelector(selectFavoriteSummaries);

  if (!favorites.length) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Favori Ürünler</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <article
              key={`favorite-skeleton-${index}`}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <Skeleton height={112} width={112} borderRadius={16} />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton height={14} width="30%" />
                <Skeleton height={20} width="90%" />
                <Skeleton height={20} width="60%" />
                <Skeleton height={16} width="50%" />
              </div>
            </article>
          ))}
        </div>
        <EmptyState
          title="Favori listen boş"
          description="Ürünleri favoriye ekleyerek burada hızlıca erişebilirsin."
        />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Favori Ürünler ({favorites.length})
      </h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {favorites.map((favorite) => (
          <article
            key={favorite.id}
            className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="relative h-28 w-28 overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800">
              <Image
                src={favorite.imageUrl ?? "/placeholder-product.svg"}
                alt={favorite.name}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    {favorite.brandName ?? "Marka"}
                  </p>
                  <Link
                    href={`/products/${favorite.id}`}
                    className="line-clamp-2 text-base font-semibold text-slate-900 dark:text-slate-100"
                    title={favorite.name}
                  >
                    {favorite.name}
                  </Link>
                </div>
                <FavoriteButton productId={favorite.id} summary={favorite} />
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {(() => {
                  const currency = normalizeCurrency(favorite.currency);
                  try {
                    return favorite.price.toLocaleString("tr-TR", {
                      style: "currency",
                      currency,
                    });
                  } catch {
                    return `${favorite.price.toFixed(2)} ${currency}`;
                  }
                })()}
              </p>
              <Link
                href={`/products/${favorite.id}`}
                className="text-sm font-semibold text-brand hover:underline"
              >
                Ürün detayına git
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

