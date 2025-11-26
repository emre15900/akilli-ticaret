export interface VariantValue {
  key: string;
  value: string;
}

export interface VariantSubValue {
  id: number;
  key: string;
  value: string;
}

export interface ProductProperty {
  id: number;
  barcode: string;
  price: number;
  stock: number;
  variantValues: VariantValue[];
  variantSubValues: VariantSubValue[];
}

export interface ProductImage {
  relatedBarcodes: string | string[] | null;
  relatedBarcodesRaw?: string | string[] | null;
  imagePath: string;
}

export interface Brand {
  id: number;
  mname: string;
  picture?: string | null;
}

export interface Category {
  id: number;
  categoryName: string;
  url: string;
}

export interface Product {
  id: number;
  stockCode?: string | null;
  stock?: number | null;
  gtin?: string | null;
  manufacturerPartNumber?: string | null;
  discountRate?: number | null;
  incrementRange?: number | null;
  isInFavorite?: boolean | null;
  name: string;
  totalRecord?: number | null;
  url?: string | null;
  vat?: number | null;
  salePrice?: number | null;
  salePriceWithTax?: number | null;
  oldPrice?: number | null;
  oldPriceWithTax?: number | null;
  price: number;
  priceWithTax?: number | null;
  currency: string;
  brand?: Brand | null;
  category?: Category | null;
  productProperties: ProductProperty[];
  productImages: ProductImage[];
}

export interface ProductListResponse {
  totalPages: number;
  totalRecord: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  products: Product[];
  __typename?: string;
}

export interface FavoriteProductSummary {
  id: number;
  name: string;
  imageUrl?: string | null;
  price: number;
  priceWithTax?: number | null;
  currency: string;
  stock?: number | null;
  brandName?: string | null;
}

export const buildFavoriteSummary = (product: Product): FavoriteProductSummary => ({
  id: product.id,
  name: product.name,
  imageUrl: product.productImages.at(0)?.imagePath ?? null,
  price: product.salePrice ?? product.price,
  priceWithTax: product.salePriceWithTax ?? product.priceWithTax,
  currency: product.currency,
  stock: product.stock,
  brandName: product.brand?.mname ?? null,
});

export interface PriceRange {
  min?: number;
  max?: number;
}

