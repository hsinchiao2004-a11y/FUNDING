export const formatTWD = (value: number): string =>
  `NT$${new Intl.NumberFormat("zh-Hant-TW", {
    maximumFractionDigits: 0,
  }).format(value)}`;

export const formatCompactTWD = (value: number): string =>
  `NT$${new Intl.NumberFormat("zh-Hant-TW", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)}`;

export const formatPct = (value: number, digits = 1): string =>
  `${value.toFixed(digits)}%`;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));
