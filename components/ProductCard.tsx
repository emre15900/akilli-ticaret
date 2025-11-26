"use client";

import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "./FavoriteButton";
import type { Product } from "@/types/product";
import { buildFavoriteSummary } from "@/types/product";
import { normalizeCurrency } from "@/utils/currency";
import { getImageForBarcode } from "@/utils/barcodeMatching";
import {
  resolveProductPrice,
  resolveProductPreviousPrice,
  resolveProductStock,
} from "@/utils/productMetrics";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const price = resolveProductPrice(product);
  const previousPrice = resolveProductPreviousPrice(product);
  const currencyCode = normalizeCurrency(product.currency);
  const stock = resolveProductStock(product);

  const formatCurrency = (value: number) => {
    try {
      return value.toLocaleString("tr-TR", {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits: 2,
      });
    } catch {
      return `${value.toFixed(2)} ${currencyCode}`;
    }
  };

  const formattedPrice = formatCurrency(price);
  const hasDiscount = previousPrice > price;
  const formattedPreviousPrice = hasDiscount
    ? formatCurrency(previousPrice)
    : null;
  const discountRate = hasDiscount
    ? Math.round(((previousPrice - price) / previousPrice) * 100)
    : 0;
  const primaryProperty = product.productProperties?.[0];
  const imageUrl =
    getImageForBarcode(product.productImages, primaryProperty?.barcode) ??
    product.productImages.at(0)?.imagePath ??
    "/placeholder-product.svg";

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="relative mb-4 block h-48 w-full overflow-hidden rounded-xl bg-slate-50">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover object-center"
          priority={false}
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {product.brand?.mname ?? "Marka"}
            </p>
            <Link
              href={`/products/${product.id}`}
              className="line-clamp-2 text-base font-semibold text-slate-900"
              title={product.name}
            >
              {product.name}
            </Link>
          </div>
          <FavoriteButton
            productId={product.id}
            summary={buildFavoriteSummary(product)}
            className="shrink-0"
          />
        </div>
        <p className="text-sm text-slate-500">
          Stok:{" "}
          <span className="font-semibold text-slate-900">
            {stock}
          </span>
        </p>
        <div className="space-y-1">
          {hasDiscount && formattedPreviousPrice && (
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-400 line-through">
                {formattedPreviousPrice}
              </p>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold uppercase tracking-tight text-red-600">
                %{discountRate}
              </span>
            </div>
          )}
          <p className="text-lg font-bold text-slate-900">{formattedPrice}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <Link
            href={`/products/${product.id}`}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            İncele
          </Link>
          <span className="text-xs font-medium text-slate-400">
            Kod: {product.stockCode ?? "—"}
          </span>
        </div>
      </div>
    </article>
  );
};

