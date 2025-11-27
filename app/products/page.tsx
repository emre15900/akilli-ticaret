"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { FiltersPanel } from "@/components/FiltersPanel";
import { ProductList } from "@/components/ProductList";
import type { PriceRange } from "@/types/product";

const parseNumberParam = (value: string | null) => {
  if (!value) {
    return undefined;
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categoryOptions, setCategoryOptions] = useState<
    { id: number; label: string }[]
  >([]);
  const handleCategoryOptions = useCallback(
    (incoming: { id: number; label: string }[]) => {
      if (!incoming.length) {
        return;
      }
      setCategoryOptions((current) => {
        const orderAwareMap = new Map<number, string>();
        current.forEach((item) => {
          orderAwareMap.set(item.id, item.label);
        });
        incoming.forEach((item) => {
          orderAwareMap.set(item.id, item.label);
        });

        const merged = Array.from(orderAwareMap.entries())
          .map(([id, label]) => ({ id, label }))
          .sort((a, b) =>
            a.label.localeCompare(b.label, "tr", { sensitivity: "base" }),
          );

        const isSameAsCurrent =
          merged.length === current.length &&
          merged.every(
            (item, index) =>
              item.id === current[index]?.id &&
              item.label === current[index]?.label,
          );

        return isSameAsCurrent ? current : merged;
      });
    },
    [],
  );

  const queryValue = searchParams.get("q") ?? "";
  const selectedCategoryId = parseNumberParam(searchParams.get("category"));
  const inStockOnly = searchParams.get("inStock") === "true";
  const minPrice = parseNumberParam(searchParams.get("min"));
  const maxPrice = parseNumberParam(searchParams.get("max"));
  const mode: "infinite" = "infinite";
  const page = parseNumberParam(searchParams.get("page")) ?? 1;

  const priceRange: PriceRange = useMemo(
    () => ({
      min: minPrice,
      max: maxPrice,
    }),
    [minPrice, maxPrice],
  );

  const updateQueryParams = (nextParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(nextParams).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    const queryString = params.toString();
    router.replace(
      queryString ? `/products?${queryString}` : "/products",
      { scroll: false },
    );
  };

  const handleSearch = (value: string) => {
    updateQueryParams({
      q: value || null,
      page: "1",
    });
  };

  const formatNumberParam = (value?: number) =>
    value === undefined || value === null ? null : String(value);

  const handleFiltersChange = (payload: {
    categoryId?: number;
    inStockOnly?: boolean;
    priceRange?: PriceRange;
  }) => {
    const hasCategoryUpdate = Object.prototype.hasOwnProperty.call(
      payload,
      "categoryId",
    );
    const nextCategory = hasCategoryUpdate
      ? payload.categoryId
      : selectedCategoryId;
    const nextInStock =
      payload.inStockOnly !== undefined ? payload.inStockOnly : inStockOnly;
    const nextPriceRange = payload.priceRange ?? priceRange;

    updateQueryParams({
      category:
        typeof nextCategory === "number" ? String(nextCategory) : null,
      inStock: nextInStock ? "true" : null,
      min: formatNumberParam(nextPriceRange?.min),
      max: formatNumberParam(nextPriceRange?.max),
      page: "1",
    });
  };

  const handleResetFilters = () => {
    updateQueryParams({
      category: null,
      inStock: null,
      min: null,
      max: null,
      q: null,
      page: "1",
    });
  };

  const handlePageChange = (nextPage: number) => {
    updateQueryParams({
      page: String(nextPage),
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <SearchBar initialValue={queryValue} onSearch={handleSearch} />
        </div>
      </div>

      <FiltersPanel
        categories={categoryOptions}
        selectedCategoryId={selectedCategoryId}
        inStockOnly={inStockOnly}
        priceRange={priceRange}
        onChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      <ProductList
        search={queryValue}
        categoryId={selectedCategoryId}
        inStockOnly={inStockOnly}
        priceRange={priceRange}
        mode={mode}
        page={page}
        onPageChange={handlePageChange}
        onCategoriesChange={handleCategoryOptions}
      />
    </section>
  );
}

const ProductsPageFallback = () => (
  <section className="space-y-4">
    <div className="h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
    <div className="h-24 rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-2 h-4 w-1/3 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
      <div className="space-y-2">
        <div className="h-3 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>
    </div>
  </section>
);

