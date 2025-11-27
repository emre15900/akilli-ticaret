"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCT_DETAILS, GET_PRODUCTS } from "@/lib/graphql/queries";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { VariantSelector } from "@/components/VariantSelector";
import { getImageForBarcode } from "@/utils/barcodeMatching";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { Product, ProductListResponse } from "@/types/product";
import { buildFavoriteSummary } from "@/types/product";
import { normalizeCurrency } from "@/utils/currency";
import {
  normalizeNumericValue,
  resolveProductPrice,
  resolveProductStock,
} from "@/utils/productMetrics";

interface ProductDetailsQueryResult {
  productDetails?: Product | null;
}

interface ProductsByFilterQueryResult {
  productsByFilter?: ProductListResponse | null;
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = Number(params.id);
  const { data, loading, error, refetch } = useQuery<ProductDetailsQueryResult>(
    GET_PRODUCT_DETAILS,
    {
      variables: { productId },
      skip: Number.isNaN(productId),
    },
  );
  const product: Product | undefined = data?.productDetails ?? undefined;

  const { data: fallbackImagesData } = useQuery<ProductsByFilterQueryResult>(
    GET_PRODUCTS,
    {
      variables: { filter: { productId } },
      skip: Number.isNaN(productId) || Boolean(product?.productImages?.length),
    },
  );

  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null,
  );

  const selectedProperty = useMemo(() => {
    if (!product?.productProperties?.length || selectedPropertyId == null) {
      return undefined;
    }
    return product.productProperties.find(
      (property) => property.id === selectedPropertyId,
    );
  }, [product, selectedPropertyId]);

  const productImages = useMemo(() => {
    if (product?.productImages?.length) {
      return product.productImages;
    }
    return (
      fallbackImagesData?.productsByFilter?.products?.[0]?.productImages ?? []
    );
  }, [product, fallbackImagesData]);

  const heroImage = useMemo(
    () => getImageForBarcode(productImages, selectedProperty?.barcode),
    [productImages, selectedProperty],
  );
  const totalStock = useMemo(
    () => (product ? resolveProductStock(product) : 0),
    [product],
  );
  const selectedVariantStock = useMemo(() => {
    if (!selectedProperty) {
      return undefined;
    }
    return normalizeNumericValue(selectedProperty.stock);
  }, [selectedProperty]);

  if (Number.isNaN(productId)) {
    return <ErrorState message="Geçersiz ürün kimliği." />;
  }

  if (loading) {
    return (
      <section className="card-surface grid gap-8 rounded-2xl border border-slate-200 p-6 shadow-sm lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface-dynamic">
            <Skeleton height="100%" />
          </div>
          <Skeleton height={48} width="60%" borderRadius="999px" />
          <Skeleton height={70} borderRadius="1rem" />
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton height={16} width="25%" />
            <Skeleton height={32} width="80%" />
            <Skeleton height={18} width="40%" />
          </div>
          <div className="rounded-2xl bg-surface-dynamic p-4">
            <Skeleton height={16} width="20%" />
            <div className="mt-3 space-y-2">
              <Skeleton height={34} width="50%" />
              <Skeleton height={18} width="35%" />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
            <Skeleton height={16} width="30%" />
            <div className="mt-3 space-y-2">
              <Skeleton height={16} width="60%" />
              <Skeleton height={16} width="45%" />
              <Skeleton height={16} width="70%" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <ErrorState
        message="Ürün detayları yüklenemedi."
        onRetry={() => refetch()}
      />
    );
  }

  const basePrice = resolveProductPrice(product);
  const variantPrice =
    selectedPropertyId !== null
      ? normalizeNumericValue(selectedProperty?.price)
      : undefined;
  const price =
    variantPrice && variantPrice > 0 ? variantPrice : basePrice;
  const currencyCode = normalizeCurrency(product.currency);
  const formattedPrice = (() => {
    try {
      return price.toLocaleString("tr-TR", {
        style: "currency",
        currency: currencyCode,
      });
    } catch {
      return `${price.toFixed(2)} ${currencyCode}`;
    }
  })();
  return (
    <section className="card-surface grid gap-8 rounded-2xl border border-slate-200 p-6 shadow-sm transition-colors dark:border-slate-800 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface-dynamic">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-center"
              priority
            />
          ) : (
            <Skeleton height="100%" />
          )}
        </div>
        <VariantSelector
          properties={product.productProperties}
          selectedBarcode={
            selectedPropertyId ? selectedProperty?.barcode ?? undefined : undefined
          }
          onSelect={(property) => setSelectedPropertyId(property.id)}
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {product.brand?.mname}
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{product.name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Kod: {product.stockCode}</p>
          </div>
          <FavoriteButton
            productId={product.id}
            summary={buildFavoriteSummary(product)}
            variant="pill"
            fullWidthOnMobile
            hideLabel
          />
        </div>

        <div className="space-y-2 rounded-2xl bg-surface-dynamic p-4">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Fiyat</p>
          <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{formattedPrice}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Stok:{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {totalStock}
            </span>
            {selectedVariantStock !== undefined &&
              selectedVariantStock !== totalStock && (
                <span className="ml-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                  (Seçili varyant: {selectedVariantStock})
                </span>
              )}
          </p>
        </div>

        <div className="space-y-2 rounded-2xl border border-slate-100 bg-surface-dynamic p-4 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">Seçili varyant</p>
          <ul className="text-sm text-slate-600 dark:text-slate-200">
            {selectedProperty?.variantValues?.map((value) => (
              <li key={`${value.key}-${value.value}`}>
                {value.key}:{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {value.value}
                </span>
              </li>
            )) ?? <li>Standart ürün</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}

