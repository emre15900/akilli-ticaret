"use client";

import clsx from "clsx";
import type { ProductProperty } from "@/types/product";

interface VariantSelectorProps {
  properties: ProductProperty[];
  selectedBarcode?: string | null;
  onSelect: (property: ProductProperty) => void;
}

const buildVariantLabel = (property: ProductProperty) => {
  if (!property.variantValues?.length) {
    return property.barcode;
  }
  return property.variantValues.map((value) => value.value).join(" / ");
};

export const VariantSelector = ({
  properties,
  selectedBarcode,
  onSelect,
}: VariantSelectorProps) => {
  if (!properties.length) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold text-slate-700">Varyant Seçimi</p>
      <div className="flex flex-wrap gap-2">
        {properties.map((property) => {
          const isActive = property.barcode === selectedBarcode;
          return (
            <button
              key={property.id}
              type="button"
              className={clsx(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                isActive
                  ? "border-brand bg-brand text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-brand hover:text-brand",
              )}
              onClick={() => onSelect(property)}
            >
              {buildVariantLabel(property)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

