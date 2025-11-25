"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { selectFavoriteSummaries } from "@/store/favoritesSlice";
import { EmptyState } from "@/components/ui/EmptyState";
import { FavoriteButton } from "@/components/FavoriteButton";
import { normalizeCurrency } from "@/utils/currency";

export default function FavoritesPage() {
  const favorites = useAppSelector(selectFavoriteSummaries);

  if (!favorites.length) {
    return (
      <EmptyState
        title="Favori listen boş"
        description="Ürünleri favoriye ekleyerek burada hızlıca erişebilirsin."
      />
    );
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">
        Favori Ürünler ({favorites.length})
      </h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {favorites.map((favorite) => (
          <article
            key={favorite.id}
            className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="relative h-28 w-28 overflow-hidden rounded-xl bg-slate-50">
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
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    {favorite.brandName ?? "Marka"}
                  </p>
                  <Link
                    href={`/products/${favorite.id}`}
                    className="line-clamp-2 text-base font-semibold text-slate-900"
                  >
                    {favorite.name}
                  </Link>
                </div>
                <FavoriteButton productId={favorite.id} summary={favorite} />
              </div>
              <p className="text-lg font-bold text-slate-900">
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

