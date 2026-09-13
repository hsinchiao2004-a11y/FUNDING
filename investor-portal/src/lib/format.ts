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

// 二級市場結算幣種：NT$ 之外，也可用穩定幣（USDT/USDC）或平台原生代幣（旺鋪幣／WPT）計價，由轉讓方自行選擇。
export const formatByCurrency = (value: number, currency: "TWD" | "USDT" | "USDC" | "WPT"): string => {
  if (currency === "TWD") return formatTWD(value);
  return `${new Intl.NumberFormat("zh-Hant-TW", { maximumFractionDigits: 2 }).format(value)} ${currency}`;
};

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));
