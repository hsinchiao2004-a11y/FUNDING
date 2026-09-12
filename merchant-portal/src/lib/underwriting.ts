import { clamp } from "./format";

export interface CreditProfile {
  taxId: string;
  incomeTaxDocsUploaded: boolean; // 歷年營利事業所得稅申報資料（自開始繳納以來）
  businessTaxDocsUploaded: boolean; // 歷年營業稅籍資料（自開始繳納以來）
  bankAccount: string;
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
}

export const emptyCreditProfile: CreditProfile = {
  taxId: "",
  incomeTaxDocsUploaded: false,
  businessTaxDocsUploaded: false,
  bankAccount: "",
  bankStatementUploaded: false,
  posConnected: false,
  creditScore: null,
};

// 以 RRS（Revenue Reliability Score，0-100）換算成聯徵風格的信用評分（示範用途，非真實信用評分模型）。
export function scoreFromRRS(rrs: number): number {
  return Math.round(clamp(600 + rrs * 1.7, 550, 850));
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
  };
}

export function isValidTaxId(taxId: string): boolean {
  return /^\d{8}$/.test(taxId);
}
