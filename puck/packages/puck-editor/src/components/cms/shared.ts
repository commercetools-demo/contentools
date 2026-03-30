// Shared helpers used across CMS Puck components

export const getLocalizedText = (obj?: Record<string, string> | null): string => {
  if (!obj) return '';
  return obj['en-US'] ?? obj['en'] ?? Object.values(obj)[0] ?? '';
};

export const formatPrice = (
  centAmount: number,
  currencyCode = 'USD',
  fractionDigits = 2
): string => {
  const amount = centAmount / Math.pow(10, fractionDigits);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};

export const getFirstPrice = (
  product: unknown
): { centAmount: number; currencyCode: string; fractionDigits: number } | null => {
  const p = product as any;
  return p?.masterVariant?.prices?.[0]?.value ?? null;
};

export const getProductImage = (product: unknown): string | null => {
  const p = product as any;
  return p?.masterVariant?.images?.[0]?.url ?? null;
};

export const getProductName = (product: unknown): string => {
  const p = product as any;
  return getLocalizedText(p?.name) || 'Product';
};

export const getProductSlug = (product: unknown): string => {
  const p = product as any;
  return getLocalizedText(p?.slug) || p?.id || '#';
};

// Colour palette shared across components
export const colors = {
  primary: '#2c5530',
  primaryHover: '#1e3a21',
  lightBg: '#f0f7f0',
  lightBorder: '#c8e6c8',
  text: '#333',
  textMuted: '#666',
  border: '#eee',
  bg: '#f5f5f5',
};
