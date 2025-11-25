const FALLBACK_CURRENCY = "TRY";

export const normalizeCurrency = (value?: string | null) => {
  const cleaned = value
    ?.replace(/[^\w]/g, "")
    .trim()
    .toUpperCase();

  if (!cleaned || cleaned === "TL") {
    return FALLBACK_CURRENCY;
  }

  return cleaned;
};

