import { gql } from "@apollo/client";

export const PRODUCT_FRAGMENT = gql`
  fragment ProductFields on Product {
    id
    stockCode
    stock
    gtin
    manufacturerPartNumber
    discountRate
    incrementRange
    isInFavorite
    name
    totalRecord
    url
    vat
    salePrice
    salePriceWithTax
    oldPrice
    oldPriceWithTax
    price
    priceWithTax
    currency
    brand {
      id
      mname
      picture
    }
    category {
      id
      categoryName
      url
    }
    productProperties {
      id
      barcode
      price
      stock
      variantValues {
        key
        value
      }
      variantSubValues {
        id
        key
        value
      }
    }
    productImages {
      relatedBarcodes
      relatedBarcodesRaw
      imagePath
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($filter: ProductFilterInput!) {
    productsByFilter(filter: $filter) {
      totalPages
      totalRecord
      currentPage
      hasNextPage
      hasPreviousPage
      products {
        ...ProductFields
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($productId: Int!) {
    productDetails(productId: $productId) {
      ...ProductFields
    }
  }
  ${PRODUCT_FRAGMENT}
`;

