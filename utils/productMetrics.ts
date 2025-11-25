import type { Product } from "@/types/product";

const toNumericValue = (value?: number | string | null) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === "string") {
    const normalized = value.trim().replace(",", ".");
    if (!normalized) {
      return undefined;
    }
    const numeric = Number(normalized);
    return Number.isFinite(numeric) ? numeric : undefined;
  }

  return undefined;
};

export const resolveProductPrice = (product: Product) => {
  const candidates: number[] = [];

  const pushCandidate = (value?: number | string | null) => {
    const numeric = toNumericValue(value);
    if (numeric !== undefined) {
      candidates.push(numeric);
    }
  };

  [
    product.salePrice,
    product.price,
    product.salePriceWithTax,
    product.priceWithTax,
  ].forEach(pushCandidate);

  product.productProperties?.forEach((property) => {
    pushCandidate(property.price);
  });

  const positiveCandidates = candidates.filter((value) => value > 0);
  if (positiveCandidates.length) {
    return Math.min(...positiveCandidates);
  }

  if (candidates.length) {
    return Math.min(...candidates);
  }

  return 0;
};

export const resolveProductStock = (product: Product) => {
  const directStock = toNumericValue(product.stock);
  if (directStock !== undefined) {
    return directStock;
  }

  if (product.productProperties?.length) {
    return product.productProperties.reduce((total, property) => {
      const propertyStock = toNumericValue(property.stock) ?? 0;
      return total + propertyStock;
    }, 0);
  }

  return 0;
};

export const normalizeNumericValue = (value?: number | string | null) =>
  toNumericValue(value);


