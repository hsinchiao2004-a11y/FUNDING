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

// 二級市場結算幣種：NT$ 之外，也可用穩定幣（USDT/USDC）或平台原生代幣（挺店幣／WPT）計價，由轉讓方自行選擇。
export const formatByCurrency = (value: number, currency: "TWD" | "USDT" | "USDC" | "WPT"): string => {
  if (currency === "TWD") return formatTWD(value);
  return `${new Intl.NumberFormat("zh-Hant-TW", { maximumFractionDigits: 2 }).format(value)} ${currency}`;
};

// 平台幣（挺店幣／WPT）固定掛牌匯率：1 WPT = NT$1,000。投資人將平台幣轉入特定
// 商家專屬合約才構成投資，因此投資金額一律以 WPT 計價，而非直接以新台幣計價。
export const WPT_RATE_TWD = 1000;
export const twdToWpt = (twd: number): number => twd / WPT_RATE_TWD;
export const wptToTwd = (wpt: number): number => wpt * WPT_RATE_TWD;
export const formatWpt = (wpt: number): string =>
  `${new Intl.NumberFormat("zh-Hant-TW", { maximumFractionDigits: 2 }).format(wpt)} WPT`;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));
