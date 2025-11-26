"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  FiTag,
  FiTrendingUp,
  FiRefreshCw,
  FiChevronDown,
  FiCheckCircle,
  FiCircle,
} from "react-icons/fi";
import type { PriceRange } from "@/types/product";

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

  useEffect(() => {
    setMinPrice(priceRange?.min?.toString() ?? "");
    setMaxPrice(priceRange?.max?.toString() ?? "");
  }, [priceRange]);

  const emitPriceRange = ({
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
  };

  return (
    <section className="rounded-3xl border border-slate-100 bg-gradient-to-br from-white via-white to-slate-50 p-5 shadow-lg shadow-slate-100">
      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Akıllı filtreler
          </p>
          <h3 className="text-lg font-bold text-slate-900">
            Aradığın ürünü hızla bul
          </h3>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          onClick={() => {
            setMinPrice("");
            setMaxPrice("");
            onReset?.();
          }}
        >
          <FiRefreshCw />
          Filtreleri temizle
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <label className="col-span-2 flex flex-col gap-2 text-sm font-semibold text-slate-700 md:col-span-1">
          Kategori
          <div className="relative">
            <FiTag className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
            <select
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm font-medium text-slate-700 shadow-inner focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
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

        <div className="col-span-2 flex flex-col gap-3 text-sm font-semibold text-slate-700 md:col-span-1">
          Stok Durumu
          <button
            type="button"
            aria-pressed={Boolean(inStockOnly)}
            className={clsx(
              "flex items-center gap-3 rounded-2xl border px-4 py-2 text-sm font-medium transition",
              inStockOnly
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
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

        <div className="col-span-2 grid gap-3 text-sm font-semibold text-slate-700 md:col-span-2 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            Min. fiyat
            <div className="relative">
              <FiTrendingUp className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
              <input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                onBlur={(event) =>
                  emitPriceRange({ min: event.target.value, max: maxPrice })
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    emitPriceRange({
                      min: event.currentTarget.value,
                      max: maxPrice,
                    });
                  }
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 shadow-inner focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </label>

          <label className="flex flex-col gap-2">
            Maks. fiyat
            <div className="relative">
              <FiTrendingUp className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
              <input
                type="number"
                inputMode="decimal"
                placeholder="1000"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                onBlur={(event) =>
                  emitPriceRange({ min: minPrice, max: event.target.value })
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    emitPriceRange({
                      min: minPrice,
                      max: event.currentTarget.value,
                    });
                  }
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 shadow-inner focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </label>
        </div>
      </div>
    </section>
  );
};

