const turkishToAscii = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");

const COLOR_MAP: Record<string, string> = {
  kirmizi: "#ef4444",
  siyah: "#0f172a",
  beyaz: "#f8fafc",
  beyazsiyah: "#f8fafc",
  gri: "#94a3b8",
  lacivert: "#0b134f",
  mavi: "#3b82f6",
  turuncu: "#f97316",
  sari: "#facc15",
  yesil: "#22c55e",
  pembe: "#ec4899",
  mor: "#8b5cf6",
  kahverengi: "#92400e",
  antrasit: "#1f2937",
};

export const resolveColorHex = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const normalized = turkishToAscii(value.trim());
  if (COLOR_MAP[normalized]) {
    return COLOR_MAP[normalized];
  }

  // Attempt to use the raw value as CSS color (e.g., #ff0000 or 'red')
  if (/^#([0-9a-f]{3}){1,2}$/i.test(value.trim())) {
    return value.trim();
  }

  return null;
};

