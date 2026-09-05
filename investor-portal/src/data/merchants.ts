export type RiskTier = "low" | "medium" | "elevated";

export interface Merchant {
  id: string;
  name: string;
  category: string;
  city: string;
  founded: number;
  storefronts: number;
  rrs: number; // Revenue Reliability Score, 0-100
  riskTier: RiskTier;
  monthlyRevenue: number[]; // last 12 months, TWD
  financing: {
    amount: number; // 融資金額
    monthlyShareRate: number; // 每月分潤比例
    minMonthlyRepay: number; // 最低月還款
    capMultiple: number; // 總回收上限倍數
    raised: number; // 已募集金額
    investors: number;
    expectedAnnualReturn: [number, number]; // range, %
    estTermMonths: [number, number];
    useOfFunds: { label: string; pct: number }[];
  };
  perks: string[];
  story: string;
}

const m = (n: number[]) => n;

export const merchants: Merchant[] = [
  {
    id: "brew-and-bloom",
    name: "花見咖啡 Brew & Bloom",
    category: "特色餐飲",
    city: "台北｜大安區",
    founded: 2021,
    storefronts: 1,
    rrs: 82,
    riskTier: "low",
    monthlyRevenue: m([620, 640, 700, 690, 710, 760, 820, 790, 860, 900, 940, 980]).map(v => v * 1000),
    financing: {
      amount: 3_000_000,
      monthlyShareRate: 0.05,
      minMonthlyRepay: 10_000,
      capMultiple: 1.2,
      raised: 2_040_000,
      investors: 143,
      expectedAnnualReturn: [9, 13],
      estTermMonths: [16, 22],
      useOfFunds: [
        { label: "租金保證金", pct: 40 },
        { label: "店面裝修", pct: 40 },
        { label: "設備採購", pct: 20 },
      ],
    },
    perks: ["投資人專屬 9 折會員卡", "新品優先試喝資格", "季度店主見面會"],
    story: "從一間 12 坪的選豆吧起家，靠社群口碑做到大安區排隊名店，現在要開第二間店。",
  },
  {
    id: "goodgrain",
    name: "穀好選物 Goodgrain",
    category: "選物店",
    city: "台中｜西區",
    founded: 2020,
    storefronts: 2,
    rrs: 76,
    riskTier: "low",
    monthlyRevenue: m([480, 510, 470, 530, 560, 600, 590, 640, 610, 660, 700, 690]).map(v => v * 1000),
    financing: {
      amount: 2_200_000,
      monthlyShareRate: 0.045,
      minMonthlyRepay: 8_000,
      capMultiple: 1.25,
      raised: 990_000,
      investors: 87,
      expectedAnnualReturn: [10, 15],
      estTermMonths: [18, 24],
      useOfFunds: [
        { label: "店面裝修", pct: 45 },
        { label: "首批選品進貨", pct: 35 },
        { label: "設備採購", pct: 20 },
      ],
    },
    perks: ["投資人專屬選品優先購", "生活選物體驗日邀請"],
    story: "以在地職人選品聞名，兩間門市營運穩定，準備進駐台中最新商場拓點。",
  },
  {
    id: "noodle-house",
    name: "老張牛肉麵",
    category: "特色餐飲",
    city: "新北｜板橋區",
    founded: 2016,
    storefronts: 1,
    rrs: 88,
    riskTier: "low",
    monthlyRevenue: m([850, 870, 900, 860, 880, 910, 950, 920, 960, 1000, 1020, 1050]).map(v => v * 1000),
    financing: {
      amount: 3_600_000,
      monthlyShareRate: 0.05,
      minMonthlyRepay: 12_000,
      capMultiple: 1.2,
      raised: 3_150_000,
      investors: 201,
      expectedAnnualReturn: [8, 11],
      estTermMonths: [14, 18],
      useOfFunds: [
        { label: "第二店面租金", pct: 40 },
        { label: "店面裝修", pct: 40 },
        { label: "廚房設備", pct: 20 },
      ],
    },
    perks: ["投資人專屬招待券 6 張／年", "尾牙聚餐優先席位"],
    story: "深耕板橋 8 年的排隊名店，營收穩定成長，準備開出第二間分店。",
  },
  {
    id: "atelier-soap",
    name: "皂研所 Atelier Soap",
    category: "生活品牌",
    city: "高雄｜鹽埕區",
    founded: 2019,
    storefronts: 1,
    rrs: 68,
    riskTier: "medium",
    monthlyRevenue: m([310, 330, 300, 340, 360, 350, 380, 400, 370, 410, 430, 420]).map(v => v * 1000),
    financing: {
      amount: 1_500_000,
      monthlyShareRate: 0.04,
      minMonthlyRepay: 6_000,
      capMultiple: 1.3,
      raised: 420_000,
      investors: 41,
      expectedAnnualReturn: [11, 17],
      estTermMonths: [20, 28],
      useOfFunds: [
        { label: "生產設備擴充", pct: 50 },
        { label: "原料備貨", pct: 30 },
        { label: "門市改裝", pct: 20 },
      ],
    },
    perks: ["投資人專屬手作體驗課", "新品上市搶先購"],
    story: "手工皂與保養品牌，電商與門市雙軌成長，正在擴充產能因應通路詢單。",
  },
  {
    id: "riverside-pizza",
    name: "河岸柴燒披薩",
    category: "特色餐飲",
    city: "台南｜安平區",
    founded: 2022,
    storefronts: 1,
    rrs: 71,
    riskTier: "medium",
    monthlyRevenue: m([260, 280, 300, 330, 350, 370, 400, 430, 410, 450, 470, 500]).map(v => v * 1000),
    financing: {
      amount: 1_800_000,
      monthlyShareRate: 0.045,
      minMonthlyRepay: 7_000,
      capMultiple: 1.3,
      raised: 540_000,
      investors: 52,
      expectedAnnualReturn: [12, 18],
      estTermMonths: [20, 26],
      useOfFunds: [
        { label: "柴燒窯設備", pct: 45 },
        { label: "戶外座位擴建", pct: 35 },
        { label: "行銷推廣", pct: 20 },
      ],
    },
    perks: ["投資人專屬野餐日邀請", "會員價 8 折"],
    story: "安平運河畔人氣柴燒披薩店，開幕兩年翻桌率持續上升，計畫擴建戶外座位。",
  },
  {
    id: "bookmark-cafe",
    name: "書籤角落 Bookmark",
    category: "選物店",
    city: "台北｜中山區",
    founded: 2018,
    storefronts: 1,
    rrs: 79,
    riskTier: "low",
    monthlyRevenue: m([390, 400, 420, 410, 440, 460, 470, 490, 480, 510, 530, 520]).map(v => v * 1000),
    financing: {
      amount: 2_000_000,
      monthlyShareRate: 0.045,
      minMonthlyRepay: 7_500,
      capMultiple: 1.25,
      raised: 1_260_000,
      investors: 96,
      expectedAnnualReturn: [10, 14],
      estTermMonths: [17, 22],
      useOfFunds: [
        { label: "二店租金保證金", pct: 40 },
        { label: "選書與選品進貨", pct: 35 },
        { label: "空間裝修", pct: 25 },
      ],
    },
    perks: ["投資人專屬選書社群", "讀書會優先報名"],
    story: "獨立書店與選物複合空間，社群黏著度高，準備在中山商圈開設第二據點。",
  },
];

export const getMerchant = (id: string) => merchants.find((m) => m.id === id);
