export interface DataSource {
  id: string;
  name: string;
  connected: boolean;
  lastSync: string; // human-readable
}

export interface RepaymentEntry {
  month: string;
  revenue: number;
  dividend: number;
}

export interface Milestone {
  label: string;
  pct: number;
  amount: number;
  status: "已撥付" | "待撥付";
  date: string;
}

export const profile = {
  name: "花見咖啡 Brew & Bloom",
  category: "特色餐飲",
  city: "台北｜大安區",
  founded: 2021,
  storefronts: 1,
};

export const rrs = {
  current: 82,
  trend: [74, 75, 77, 76, 78, 79, 80, 79, 81, 80, 82, 82],
  note: "近 3 個月營收成長穩定、無異常波動，風險評級維持「營收穩定」。",
};

export const dataSources: DataSource[] = [
  { id: "pos", name: "POS 收銀系統", connected: true, lastSync: "5 分鐘前" },
  { id: "linepay", name: "LINE Pay", connected: true, lastSync: "12 分鐘前" },
  { id: "jkopay", name: "街口支付", connected: true, lastSync: "12 分鐘前" },
  { id: "bank", name: "銀行金流帳戶", connected: true, lastSync: "今天 09:15" },
  { id: "einvoice", name: "電子發票（交叉驗證用）", connected: false, lastSync: "尚未連接" },
];

export const monthlyRevenue = [620, 640, 700, 690, 710, 760, 820, 790, 860, 900, 940, 980].map(
  (v) => v * 1000,
);

export const financing = {
  amount: 3_000_000,
  monthlyShareRate: 0.05,
  minMonthlyRepay: 10_000,
  capMultiple: 1.2,
  startedAt: "2026/3/1",
  useOfFunds: [
    { label: "租金保證金", pct: 40, amount: 1_200_000, status: "已撥付", date: "2026/3/3" },
    { label: "店面裝修", pct: 40, amount: 1_200_000, status: "已撥付", date: "2026/3/20" },
    { label: "設備採購", pct: 20, amount: 600_000, status: "待撥付", date: "預計 2026/9" },
  ] satisfies Milestone[],
};

export const repaymentHistory: RepaymentEntry[] = [
  { month: "3月", revenue: 760_000, dividend: 38_000 },
  { month: "4月", revenue: 820_000, dividend: 41_000 },
  { month: "5月", revenue: 790_000, dividend: 39_500 },
  { month: "6月", revenue: 860_000, dividend: 43_000 },
  { month: "7月", revenue: 900_000, dividend: 45_000 },
  { month: "8月", revenue: 940_000, dividend: 47_000 },
  { month: "9月", revenue: 980_000, dividend: 49_000 },
];

export const totalRepaid = repaymentHistory.reduce((sum, r) => sum + r.dividend, 0);
export const cap = financing.amount * financing.capMultiple;

export const aiSuggestions = [
  {
    type: "positive" as const,
    title: "營收連續 3 個月成長",
    body: "近 3 個月營收平均成長 6.4%，分潤回收速度較預期快，預估提前 2-3 個月完成回收。",
  },
  {
    type: "info" as const,
    title: "可申請追加額度",
    body: "依目前 RRS 分數與營收規模，預估可再申請 NT$80–120 萬元用於第二間店拓展。",
  },
  {
    type: "warning" as const,
    title: "電子發票尚未連接",
    body: "連接電子發票資料可加快 AI 風險評估更新速度，並提高未來申請額度的核准效率。",
  },
  {
    type: "promo" as const,
    title: "AI 建議提供優惠吸引投資人消費",
    body: "本月營收不如預期，AI 建議提供「到店消費享 9 折」優惠，促購 Agent 將據此生成邀請投資人到店消費的訊息。",
  },
];
