export interface CreditProfile {
  companyName: string;
  taxId: string;
  incomeTaxDocsUploaded: boolean; // 歷年營利事業所得稅申報資料（自開始繳納以來）
  businessTaxDocsUploaded: boolean; // 歷年營業稅籍資料（自開始繳納以來）
  bankAccounts: string[]; // 可提供多筆銀行帳戶
  bankStatementUploaded: boolean;
  posConnected: boolean;
  creditScore: number | null;
  avgMonthlyRevenue: number | null; // R̄24：過去 24 個月平均月營收
  maxMonthlyRevenue: number | null; // 過去 24 個月單月最高營收，用來推算營收波動度
  minMonthlyRevenue: number | null; // 過去 24 個月單月最低營收
}

export type CreditTier = "優良" | "良好" | "普通" | "待改善";

export interface CreditAssessment {
  score: number;
  tier: CreditTier;
  avgMonthlyRevenue: number; // R̄24
  mai: number; // 融資營收倍數 M_AI，AI 依營收穩定度動態核算，區間 3.0～4.5
  loanAmount: number; // 核貸額度 L = min(R̄24 × M_AI, 300萬)
  suggestedRange: [number, number]; // 申請金額可選區間，上限即為 loanAmount
  monthlyQuota: number; // A：銀行最低攤還金額（年金攤還公式，含本金）
  bankAnnualRate: number; // i：銀行依信用評級訂定之最低年利率
  termMonths: number; // n：還款期限（月），上限 84 個月
  suggestedShareRateRange: [number, number]; // rextra 建議區間（%），核准後由商家自行設定
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
  avgMonthlyRevenue: null,
  maxMonthlyRevenue: null,
  minMonthlyRevenue: null,
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

// 分潤比例建議區間（%）：信用評級愈高，代表營收愈穩定、投資人風險愈低，
// 商家不需要用較高的分潤比例來吸引投資人；評級愈低則反之。示範用途，
// 對應企劃書「rextra 由商家自行提供、疊加在銀行最低利率之上」之精神。
const shareRateRangeByTier: Record<CreditTier, [number, number]> = {
  優良: [4, 5.5],
  良好: [4.5, 6.5],
  普通: [5.5, 7],
  待改善: [6.5, 8],
};

// 銀行依信用評級訂定之最低年利率（示範用途）：評級愈高，銀行承擔風險愈低，
// 最低年利率愈低。
const bankAnnualRateByTier: Record<CreditTier, number> = {
  優良: 0.03,
  良好: 0.04,
  普通: 0.05,
  待改善: 0.065,
};

const CASE_CAP = 3_000_000; // 單案核貸上限，對標企劃書中定義的單案示範上限
const TERM_MONTHS = 84; // 還款期限上限

const roundTo = (value: number, step: number) => Math.round(value / step) * step;

export type RevenueVolatility = "stable" | "moderate" | "volatile";

// 由過去 24 個月最高/最低月營收相對平均營收的波動幅度，推算營收穩定度——
// 對應企劃書「由平台 AI agent 依據門市歷史營收穩定度...綜合評定之槓桿倍數」。
export function inferRevenueVolatility(avg: number, max: number, min: number): RevenueVolatility {
  if (avg <= 0) return "volatile";
  const spread = (max - min) / avg;
  if (spread <= 0.3) return "stable";
  if (spread <= 0.6) return "moderate";
  return "volatile";
}

// 融資營收倍數 M_AI：翻桌率極穩、現金流波動小 → 較高倍數（約 4.0x～4.5x）；
// 淡旺季營收劇烈起伏 → AI 自動壓縮倍數（約 3.0x）以降低曝險。已連接 POS
// 交易數據可讓 AI 更精確評估，額外加碼倍數。
export function computeMai(volatility: RevenueVolatility, posConnected: boolean): number {
  const base: Record<RevenueVolatility, number> = { stable: 4.25, moderate: 3.5, volatile: 3.0 };
  let mai = base[volatility];
  if (posConnected && volatility !== "volatile") mai += 0.25;
  return Math.min(4.5, Math.max(3.0, mai));
}

// 核貸額度 L = min(R̄24 × M_AI, 300萬)
export function computeLoanAmount(avgMonthlyRevenue: number, mai: number): number {
  return Math.min(roundTo(avgMonthlyRevenue * mai, 10_000), CASE_CAP);
}

// A：銀行最低攤還金額（含本金），依貸款年金攤還公式計算：
// A = L × [i(1+i)^n] / [(1+i)^n - 1]，i 為月利率、n 為還款期限總月數。
export function monthlyAmortization(loanAmount: number, annualRate: number, termMonths: number): number {
  const i = annualRate / 12;
  if (i === 0) return Math.round(loanAmount / termMonths);
  const factor = Math.pow(1 + i, termMonths);
  return Math.round((loanAmount * (i * factor)) / (factor - 1));
}

export function assessCredit(profile: CreditProfile): CreditAssessment | null {
  const { creditScore, avgMonthlyRevenue, maxMonthlyRevenue, minMonthlyRevenue } = profile;
  if (creditScore === null || avgMonthlyRevenue === null || maxMonthlyRevenue === null || minMonthlyRevenue === null) {
    return null;
  }

  const tier = tierFromScore(creditScore);
  const volatility = inferRevenueVolatility(avgMonthlyRevenue, maxMonthlyRevenue, minMonthlyRevenue);
  const mai = computeMai(volatility, profile.posConnected);
  const loanAmount = computeLoanAmount(avgMonthlyRevenue, mai);
  const bankAnnualRate = bankAnnualRateByTier[tier];
  const monthlyQuota = monthlyAmortization(loanAmount, bankAnnualRate, TERM_MONTHS);

  const rangeMin = Math.min(loanAmount, roundTo(loanAmount * 0.6, 10_000));

  return {
    score: creditScore,
    tier,
    avgMonthlyRevenue,
    mai,
    loanAmount,
    suggestedRange: [rangeMin, loanAmount],
    monthlyQuota,
    bankAnnualRate,
    termMonths: TERM_MONTHS,
    suggestedShareRateRange: shareRateRangeByTier[tier],
  };
}

export function isValidTaxId(taxId: string): boolean {
  return /^\d{8}$/.test(taxId);
}
