"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import {
  FiTag,
  FiRefreshCw,
  FiChevronDown,
  FiCheckCircle,
  FiCircle,
  FiArrowDownCircle,
  FiArrowUpCircle,
} from "react-icons/fi";
import type { PriceRange } from "@/types/product";
import { useDebounce } from "@/hooks/useDebounce";

interface FiltersPanelProps {
  categories: { id: number; label: string }[];
  selectedCategoryId?: number;
  inStockOnly?: boolean;
  priceRange?: PriceRange;
  onChange: (filters: {
    categoryId?: number;
    inStockOnly?: boolean;
    priceRange?: PriceRange;
  }) => void;
  onReset?: () => void;
}

const parseNumber = (value?: string) => {
  if (value === undefined || value === null) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const normalized = trimmed.replace(",", ".");
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : undefined;
};

export const FiltersPanel = ({
  categories,
  selectedCategoryId,
  inStockOnly,
  priceRange,
  onChange,
  onReset,
}: FiltersPanelProps) => {
  const [minPrice, setMinPrice] = useState<string>(
    priceRange?.min?.toString() ?? "",
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    priceRange?.max?.toString() ?? "",
  );

  const debouncedMinPrice = useDebounce(minPrice, 300);
  const debouncedMaxPrice = useDebounce(maxPrice, 300);
  const isFirstDebounceRun = useRef(true);

  useEffect(() => {
    setMinPrice(priceRange?.min?.toString() ?? "");
    setMaxPrice(priceRange?.max?.toString() ?? "");
  }, [priceRange]);

  const emitPriceRange = useCallback(
    ({
      min: nextMin = minPrice,
      max: nextMax = maxPrice,
    }: {
      min?: string;
      max?: string;
    } = {}) => {
      onChange({
        priceRange: {
          min: parseNumber(nextMin),
          max: parseNumber(nextMax),
        },
      });
    },
    [minPrice, maxPrice, onChange],
  );

  useEffect(() => {
    if (isFirstDebounceRun.current) {
      isFirstDebounceRun.current = false;
      return;
    }
    emitPriceRange({ min: debouncedMinPrice, max: debouncedMaxPrice });
  }, [debouncedMinPrice, debouncedMaxPrice, emitPriceRange]);

  const [isAccordionOpen, setAccordionOpen] = useState(false);

  const FilterContent = (
    <div className="grid gap-4 md:grid-cols-4">
        <label className="col-span-2 flex flex-col gap-2 text-sm font-semibold text-slate-700 md:col-span-1">
          Kategori
          <div className="relative">
            <FiTag className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
            <select
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm font-medium text-slate-700 shadow-inner focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              value={selectedCategoryId?.toString() ?? ""}
              onChange={(event) =>
                onChange({
                  categoryId: event.target.value
                    ? Number(event.target.value)
                    : undefined,
                })
              }
            >
              <option value="">Tümü</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
          </div>
        </label>

        <div className="col-span-2 flex flex-col gap-3 text-sm font-semibold text-slate-700 dark:text-slate-100 md:col-span-1">
          Stok Durumu
          <button
            type="button"
            aria-pressed={Boolean(inStockOnly)}
            className={clsx(
              "flex items-center gap-3 rounded-2xl border px-4 py-2 text-sm font-medium transition",
              inStockOnly
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500",
            )}
            onClick={() =>
              onChange({
                inStockOnly: !inStockOnly,
              })
            }
          >
            {inStockOnly ? (
              <FiCheckCircle className="text-base" />
            ) : (
              <FiCircle className="text-base" />
            )}
            Sadece stoktakiler
          </button>
        </div>

        <div className="col-span-2 grid gap-3 text-sm font-semibold text-slate-700 dark:text-slate-100 md:col-span-2 grid-cols-1 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            Min. fiyat
            <div className="relative">
              <FiArrowDownCircle className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
              <input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 shadow-inner focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </label>

          <label className="flex flex-col gap-2">
            Maks. fiyat
            <div className="relative">
              <FiArrowUpCircle className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
              <input
                type="number"
                inputMode="decimal"
                placeholder="1000"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 shadow-inner focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </label>
        </div>
    </div>
  );

  return (
    <section className="rounded-3xl border border-slate-100 bg-gradient-to-br from-white via-white to-slate-50 p-5 shadow-lg shadow-slate-100 transition-colors dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:shadow-slate-900/40">
      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-700 dark:text-slate-200">
            Filtreler
          </p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Aradığın ürünü hızla bul
          </h3>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
              onReset?.();
            }}
          >
            <FiRefreshCw />
            Filtreleri temizle
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white sm:hidden"
            onClick={() => setAccordionOpen((prev) => !prev)}
          >
            <FiChevronDown
              className={clsx(
                "transition-transform",
                isAccordionOpen ? "rotate-180" : "rotate-0",
              )}
            />
            Filtreleri {isAccordionOpen ? "gizle" : "göster"}
          </button>
        </div>
      </div>

      <div className="md:block">
        <div
          className={clsx(
            "md:!block",
            isAccordionOpen
              ? "max-h-[1200px] space-y-4 overflow-hidden transition-[max-height] duration-500 ease-out md:max-h-none"
              : "max-h-0 overflow-hidden transition-[max-height] duration-300 ease-in md:max-h-none",
          )}
        >
          {FilterContent}
        </div>
      </div>
    </section>
  );
};

