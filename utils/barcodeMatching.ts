import { ProductImage } from "@/types/product";

const splitRegex = /[,;|\s]+/;

const normalize = (value?: string | null) =>
  value?.trim().toLowerCase() ?? null;

export const splitRelatedBarcodes = (value?: string | null): string[] => {
  if (!value) {
    return [];
  }

  return value
    .split(splitRegex)
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

