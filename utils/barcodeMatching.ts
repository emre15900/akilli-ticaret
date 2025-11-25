import { ProductImage } from "@/types/product";

const splitRegex = /[,;|\s]+/;

const normalize = (value?: string | null) =>
  value?.trim().toLowerCase() ?? null;

const toStringArray = (value?: string | string[] | null) => {
  if (Array.isArray(value)) {
    return value.map((item) => (item == null ? "" : String(item)));
  }
  if (value == null) {
    return [];
  }
  return [String(value)];
};

export const splitRelatedBarcodes = (
  value?: string | string[] | null,
): string[] => {
  return toStringArray(value)
    .flatMap((entry) => entry.split(splitRegex))
    .map(normalize)
    .filter((item): item is string => Boolean(item));
};

export const getImageForBarcode = (
  images: ProductImage[],
  barcode?: string | null,
): string | null => {
  if (!images?.length) {
    return null;
  }

  if (!barcode) {
    return images[0]?.imagePath ?? null;
  }

  const normalizedBarcode = normalize(barcode);
  if (!normalizedBarcode) {
    return images[0]?.imagePath ?? null;
  }

  for (const image of images) {
    const related = [
      ...splitRelatedBarcodes(image.relatedBarcodes),
      ...splitRelatedBarcodes(image.relatedBarcodesRaw),
    ];

    if (related.includes(normalizedBarcode)) {
      return image.imagePath;
    }
  }

  return images[0]?.imagePath ?? null;
};

