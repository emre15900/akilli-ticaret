"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCT_DETAILS, GET_PRODUCTS } from "@/lib/graphql/queries";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { VariantSelector } from "@/components/VariantSelector";
import { getImageForBarcode } from "@/utils/barcodeMatching";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { Product } from "@/types/product";
import { buildFavoriteSummary } from "@/types/product";
import { normalizeCurrency } from "@/utils/currency";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = Number(params.id);
  const { data, loading, error, refetch } = useQuery(GET_PRODUCT_DETAILS, {
    variables: { productId },
    skip: Number.isNaN(productId),
  });
  const product: Product | undefined = data?.productDetails;

  const { data: fallbackImagesData } = useQuery(GET_PRODUCTS, {
    variables: { filter: { productId } },
    skip: Number.isNaN(productId) || Boolean(product?.productImages?.length),
  });

  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (product?.productProperties?.length) {
      setSelectedPropertyId(product.productProperties[0]?.id ?? null);
    }
  }, [product]);

  const selectedProperty = useMemo(() => {
    if (!product?.productProperties?.length) {
      return undefined;
    }
    return (
      product.productProperties.find(
        (property) => property.id === selectedPropertyId,
      ) ?? product.productProperties[0]
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

  if (Number.isNaN(productId)) {
    return <ErrorState message="Geçersiz ürün kimliği." />;
  }

  if (loading) {
    return <LoadingState message="Ürün bilgileri yükleniyor..." />;
  }

  if (error || !product) {
    return (
      <ErrorState
        message="Ürün detayları yüklenemedi."
        onRetry={() => refetch()}
      />
    );
  }

  const price =
    selectedProperty?.price ?? product.salePrice ?? product.price ?? 0;
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
    <section className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2">
      <div className="space-y-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-50">
          <Image
            src={heroImage ?? productImages.at(0)?.imagePath ?? "/placeholder-product.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover object-center"
            priority
          />
        </div>
        <VariantSelector
          properties={product.productProperties}
          selectedBarcode={selectedProperty?.barcode}
          onSelect={(property) => setSelectedPropertyId(property.id)}
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-400">
              {product.brand?.mname}
            </p>
            <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
            <p className="text-sm text-slate-500">Kod: {product.stockCode}</p>
          </div>
          <FavoriteButton
            productId={product.id}
            summary={buildFavoriteSummary(product)}
            variant="pill"
          />
        </div>

        <div className="space-y-2 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Fiyat</p>
          <p className="text-3xl font-black text-slate-900">{formattedPrice}</p>
          <p className="text-sm text-slate-500">
            Stok:{" "}
            <span className="font-semibold text-slate-900">
              {selectedProperty?.stock ?? product.stock ?? 0}
            </span>
          </p>
        </div>

        <div className="space-y-2 rounded-2xl border border-slate-100 p-4">
          <p className="text-sm font-semibold text-slate-700">Seçili varyant</p>
          <ul className="text-sm text-slate-600">
            {selectedProperty?.variantValues?.map((value) => (
              <li key={`${value.key}-${value.value}`}>
                {value.key}:{" "}
                <span className="font-semibold text-slate-900">
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

