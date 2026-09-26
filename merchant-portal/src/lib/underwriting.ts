export interface CreditProfile {
  companyName: string;
  taxId: string;
  incomeTaxDocsUploaded: boolean; // 歷年營利事業所得稅申報資料（自開始繳納以來）
  businessTaxDocsUploaded: boolean; // 歷年營業稅籍資料（自開始繳納以來）
  bankAccounts: string[]; // 可提供多筆銀行帳戶
  bankStatementUploaded: boolean;
  posConnected: boolean;
  creditScore: number | null;
}

export type CreditTier = "優良" | "良好" | "普通" | "待改善";

export interface CreditAssessment {
  score: number;
  tier: CreditTier;
  securedType: "有擔保" | "無擔保";
  suggestedRange: [number, number];
  monthlyQuota: number;
  minRepayPct: number;
  suggestedShareRateRange: [number, number]; // 每月營收分潤比例建議區間（%），核准後由商家自行於此區間內設定
}

export const emptyCreditProfile: CreditProfile = {
  companyName: "",
  taxId: "",
  incomeTaxDocsUploaded: false,
  businessTaxDocsUploaded: false,
  bankAccounts: [""],
  bankStatementUploaded: false,
  posConnected: false,
  creditScore: null,
};

// 信用評分來自聯合徵信中心／往來銀行信用評等，非平台自行依 RRS 等內部數據計算。
// 示範用途：固定回傳一筆模擬查詢結果，與商家其他數位營收資料無關。
export function fetchExternalCreditScore(): number {
  return 739;
}

export function tierFromScore(score: number): CreditTier {
  if (score >= 780) return "優良";
  if (score >= 700) return "良好";
  if (score >= 620) return "普通";
  return "待改善";
}

const tierMultiplier: Record<CreditTier, number> = {
  優良: 1.3,
  良好: 1.1,
  普通: 0.9,
  待改善: 0.6,
};

// 分潤比例建議區間（%）：信用評級愈高，代表營收愈穩定、投資人風險愈低，
// 商家不需要用較高的分潤比例來吸引投資人；評級愈低則反之。示範用途，
// 對應企劃書「rshare 由 AI Agent 依店況於 4%～8% 間動態核算」之精神。
const shareRateRangeByTier: Record<CreditTier, [number, number]> = {
  優良: [4, 5.5],
  良好: [4.5, 6.5],
  普通: [5.5, 7],
  待改善: [6.5, 8],
};

const BASE_RANGE: [number, number] = [800_000, 1_200_000];

const roundTo = (value: number, step: number) => Math.round(value / step) * step;

export function assessCredit(profile: CreditProfile): CreditAssessment | null {
  if (profile.creditScore === null) return null;

  const tier = tierFromScore(profile.creditScore);
  const secured = profile.bankStatementUploaded;
  const posBonus = profile.posConnected ? 1.1 : 1;
  const multiplier = tierMultiplier[tier] * posBonus;

  const min = roundTo(BASE_RANGE[0] * multiplier, 10_000);
  const max = roundTo(BASE_RANGE[1] * multiplier, 10_000);
  const monthlyQuota = roundTo(max * 0.15, 10_000);

  let minRepayPct = secured ? 4 : 5;
  if (profile.posConnected) minRepayPct -= 0.5;

  return {
    score: profile.creditScore,
    tier,
    securedType: secured ? "有擔保" : "無擔保",
    suggestedRange: [min, max],
    monthlyQuota,
    minRepayPct,
    suggestedShareRateRange: shareRateRangeByTier[tier],
  };
}

export function isValidTaxId(taxId: string): boolean {
  return /^\d{8}$/.test(taxId);
}
