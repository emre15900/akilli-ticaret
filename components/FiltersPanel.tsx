"use client";

import { useEffect, useState } from "react";
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
  const numeric = Number(value);
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
    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
      <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
        Kategori
        <select
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-700 focus:border-brand focus:ring-brand/20"
          value={selectedCategoryId?.toString() ?? ""}
          onChange={(event) =>
            onChange({
              categoryId: event.target.value
                ? Number(event.target.value)
                : undefined,
            })
          }
        >
          <option value="">Hepsi</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
        <input
          type="checkbox"
          checked={Boolean(inStockOnly)}
          onChange={(event) =>
            onChange({
              inStockOnly: event.target.checked,
            })
          }
          className="size-4 rounded border-slate-300 text-brand focus:ring-brand/30"
        />
        Stoktakiler
      </label>

      <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
        Min. Fiyat
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
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-700 focus:border-brand focus:ring-brand/20"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
        Maks. Fiyat
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
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-700 focus:border-brand focus:ring-brand/20"
        />
      </label>

      <button
        type="button"
        className="col-span-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        onClick={() => {
          setMinPrice("");
          setMaxPrice("");
          onReset?.();
        }}
      >
        Filtreleri temizle
      </button>
    </div>
  );
};

