"use client";

import { useCallback, useEffect, useMemo } from "react";
import { NetworkStatus } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { ProductCard } from "./ProductCard";
import { SkeletonCard } from "./ui/SkeletonCard";
import { ErrorState } from "./ui/ErrorState";
import { EmptyState } from "./ui/EmptyState";
import { GET_PRODUCTS } from "@/lib/graphql/queries";
import type { PriceRange, Product, ProductListResponse } from "@/types/product";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useAppDispatch } from "@/store/hooks";
import { setGlobalError } from "@/store/uiSlice";
import { resolveProductPrice, resolveProductStock } from "@/utils/productMetrics";

interface ProductListProps {
  search?: string;
  categoryId?: number;
  inStockOnly?: boolean;
  priceRange?: PriceRange;
  mode: "infinite" | "paginated";
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onCategoriesChange?: (categories: { id: number; label: string }[]) => void;
}

interface ProductsQueryResult {
  productsByFilter?: ProductListResponse | null;
}

const PAGE_SIZE = 12;

const buildFilterInput = ({
  search,
  categoryId,
  inStockOnly,
  priceRange,
  page,
  pageSize,
}: {
  search?: string;
  categoryId?: number;
  inStockOnly?: boolean;
  priceRange?: PriceRange;
  page?: number;
  pageSize?: number;
}) => {
  const filter: Record<string, unknown> = {
    pageNumber: page ?? 1,
    pageSize: pageSize ?? PAGE_SIZE,
    keyword: search?.trim() || undefined,
  };

  if (priceRange?.min !== undefined && priceRange.min !== null) {
    filter.minPrice = priceRange.min;
  }

  if (priceRange?.max !== undefined && priceRange.max !== null) {
    filter.maxPrice = priceRange.max;
  }

  if (typeof categoryId === "number") {
    filter.categoryId = [categoryId];
  }

  Object.keys(filter).forEach((key) => {
    if (filter[key] === undefined || filter[key] === null) {
      delete filter[key];
    }
  });

  return filter;
};

const PaginationControls = ({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  onChange: (nextPage: number) => void;
}) => (
  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
    <button
      type="button"
      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
      disabled={currentPage <= 1}
      onClick={() => onChange(currentPage - 1)}
    >
      Önceki
    </button>
    <p className="text-sm font-semibold text-slate-700">
      Sayfa {currentPage} / {totalPages || 1}
    </p>
    <button
      type="button"
      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
      disabled={currentPage >= totalPages}
      onClick={() => onChange(currentPage + 1)}
    >
      Sonraki
    </button>
  </div>
);

export const ProductList = ({
  search,
  categoryId,
  inStockOnly,
  priceRange,
  mode,
  page = 1,
  pageSize = PAGE_SIZE,
  onPageChange,
  onCategoriesChange,
}: ProductListProps) => {
  const dispatch = useAppDispatch();
  const filterInput = useMemo(
    () =>
      buildFilterInput({
        search,
        categoryId,
        inStockOnly,
        priceRange,
        page: mode === "paginated" ? page : 1,
        pageSize,
      }),
    [search, categoryId, inStockOnly, priceRange, mode, page, pageSize],
  );

  const {
    data,
    loading,
    error,
    fetchMore,
    refetch,
    networkStatus,
  } = useQuery<ProductsQueryResult>(GET_PRODUCTS, {
    variables: { filter: filterInput },
    notifyOnNetworkStatusChange: true,
  });

  const listResponse = data?.productsByFilter;
  const products = useMemo(
    () => listResponse?.products ?? [],
    [listResponse?.products],
  );
  const normalizedSearch = search?.trim().toLowerCase() ?? "";
  const filteredProducts = useMemo(() => {
    if (!products.length) {
      return products;
    }

    return products.filter((product) => {
      const matchesSearch = normalizedSearch
        ? [product.name, product.stockCode, product.brand?.mname]
            .filter(Boolean)
            .some((value) =>
              String(value).toLowerCase().includes(normalizedSearch),
            )
        : true;

      const matchesCategory =
        typeof categoryId === "number"
          ? product.category?.id === categoryId
          : true;

      const productPrice = resolveProductPrice(product);

      const matchesMin =
        typeof priceRange?.min === "number"
          ? productPrice >= priceRange.min
          : true;
      const matchesMax =
        typeof priceRange?.max === "number"
          ? productPrice <= priceRange.max
          : true;

      const productStock = resolveProductStock(product);
      const matchesStock = inStockOnly ? productStock > 0 : true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMin &&
        matchesMax &&
        matchesStock
      );
    });
  }, [
    products,
    normalizedSearch,
    categoryId,
    inStockOnly,
    priceRange?.min,
    priceRange?.max,
  ]);
  const hasMore = Boolean(
    mode === "infinite" && listResponse?.hasNextPage && !loading,
  );

  const handleLoadMore = useCallback(() => {
    if (!listResponse?.hasNextPage || mode !== "infinite") {
      return;
    }

    fetchMore({
      variables: {
        filter: {
          ...filterInput,
          pageNumber: (listResponse.currentPage ?? 1) + 1,
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.productsByFilter) {
          return prev;
        }

        if (!prev?.productsByFilter) {
          return fetchMoreResult;
        }

        return {
          productsByFilter: {
            ...fetchMoreResult.productsByFilter,
            products: [
              ...(prev.productsByFilter.products ?? []),
              ...(fetchMoreResult.productsByFilter.products ?? []),
            ],
          },
        };
      },
    });
  }, [fetchMore, filterInput, listResponse, mode]);

  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: networkStatus === NetworkStatus.fetchMore,
    onLoadMore: handleLoadMore,
  });

  useEffect(() => {
    if (!onCategoriesChange || !products.length) {
      return;
    }
    const uniqueMap = new Map<number, string>();
    products.forEach((product: Product) => {
      if (product.category?.id && product.category?.categoryName) {
        uniqueMap.set(product.category.id, product.category.categoryName);
      }
    });

    onCategoriesChange(
      Array.from(uniqueMap.entries()).map(([id, label]) => ({
        id,
        label,
      })),
    );
  }, [products, onCategoriesChange]);

  useEffect(() => {
    if (error) {
      dispatch(setGlobalError("Ürün listesi alınırken hata oluştu."));
    } else {
      dispatch(setGlobalError(null));
    }
  }, [dispatch, error]);

  if (error) {
    return (
      <ErrorState
        message="Ürünler yüklenirken bir hata oluştu."
        onRetry={() => refetch()}
      />
    );
  }

  if (loading && !products.length) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: pageSize }).map((_, index) => (
          <SkeletonCard key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (!loading && !filteredProducts.length) {
    return <EmptyState title="Ürün bulunamadı" />;
  }

  const renderSkeletons = (count: number) =>
    Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={`skeleton-${index}`} />
    ));

  const isFetchingMore = networkStatus === NetworkStatus.fetchMore;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {isFetchingMore && renderSkeletons(3)}
      </div>

      {mode === "infinite" ? (
        <div ref={sentinelRef} className="h-10 w-full" aria-hidden />
      ) : (
        <PaginationControls
          currentPage={listResponse?.currentPage ?? 1}
          totalPages={listResponse?.totalPages ?? 1}
          onChange={(nextPage) => onPageChange?.(nextPage)}
        />
      )}
    </div>
  );
};

