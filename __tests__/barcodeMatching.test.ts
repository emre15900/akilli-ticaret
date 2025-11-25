import { describe, expect, it } from "vitest";
import { getImageForBarcode, splitRelatedBarcodes } from "@/utils/barcodeMatching";

const images = [
  {
    relatedBarcodes: "ABC123, DEF456",
    relatedBarcodesRaw: null,
    imagePath: "https://cdn/img-1.jpg",
  },
  {
    relatedBarcodes: "xyz789",
    relatedBarcodesRaw: "xyz-789",
    imagePath: "https://cdn/img-2.jpg",
  },
];

describe("splitRelatedBarcodes", () => {
  it("should split and normalize barcodes", () => {
    expect(splitRelatedBarcodes("ABC123; def456 | ghi789")).toEqual([
      "abc123",
      "def456",
      "ghi789",
    ]);
  });

  it("should return empty array for falsy values", () => {
    expect(splitRelatedBarcodes()).toEqual([]);
  });

  it("accepts array inputs", () => {
    expect(splitRelatedBarcodes(["ABC123", "DEF 456"])).toEqual([
      "abc123",
      "def",
      "456",
    ]);
  });
});

describe("getImageForBarcode", () => {
  it("returns matching image when barcode exists", () => {
    expect(getImageForBarcode(images, "def456")).toBe("https://cdn/img-1.jpg");
  });

  it("checks raw barcode fallback", () => {
    expect(getImageForBarcode(images, "xyz-789")).toBe("https://cdn/img-2.jpg");
  });

  it("falls back to first image when nothing matches", () => {
    expect(getImageForBarcode(images, "unknown")).toBe("https://cdn/img-1.jpg");
  });

  it("returns null if no images provided", () => {
    expect(getImageForBarcode([], "abc")).toBeNull();
  });
});

