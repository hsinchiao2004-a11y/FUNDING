import type { RiskTier } from "../data/merchants";

// 退場媒合 Agent：持續掃描全平台投資人的風險偏好與資金需求，主動為每一筆持股
// 尋找潛在承接方，而不是讓投資人自己把意向丟到看板上被動等待。以下為示範用的
// 撮合結果（依商家風險等級模擬潛在承接人數與建議折讓），用來取代「投資人自己
// 猜一個價格」的傳統交易所式次級市場體驗。
const config: Record<RiskTier, { matches: number; discountPct: number }> = {
  low: { matches: 3, discountPct: 2 },
  medium: { matches: 2, discountPct: 4 },
  elevated: { matches: 1, discountPct: 7 },
};

export function getExitMatchSuggestion(tier: RiskTier) {
  return config[tier];
}

// 建議意願價格：面額扣除 Agent 判斷可加快成交的折讓幅度，四捨五入到百元。
export function suggestedExitPrice(amount: number, tier: RiskTier): number {
  const { discountPct } = config[tier];
  return Math.round((amount * (1 - discountPct / 100)) / 100) * 100;
}
