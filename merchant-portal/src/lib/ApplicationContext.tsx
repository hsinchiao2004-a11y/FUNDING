import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CollateralType = "stablecoin" | "crypto";

export interface Application {
  amount: number;
  allocation: { label: string; pct: number }[];
  shareRatePct: number; // 商家於核准後自行設定的每月營收分潤比例
  rewardOffers: string[]; // 商家於核准後自行設定的投資人回饋方式
  collateralType: CollateralType; // 抵押品類型：穩定幣 50% 或主流加密貨幣 60%
  collateralAmount: number; // 依抵押品類型比例算出的抵押品金額
  guaranteeDeposit: number; // 履約保證金，固定為融資金額 10%
  useVasp: boolean; // 是否委託合作 VASP 代為發行抵押憑證代幣
  submittedAt: string;
}

interface ApplicationState {
  applications: Application[];
  submit: (application: Omit<Application, "submittedAt">) => void;
}

const ApplicationContext = createContext<ApplicationState | null>(null);
const STORAGE_KEY = "wangpu.merchant.applications.v1";

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Application[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  }, [applications]);

  const submit = (application: Omit<Application, "submittedAt">) => {
    setApplications((prev) => [...prev, { ...application, submittedAt: new Date().toISOString() }]);
  };

  return (
    <ApplicationContext.Provider value={{ applications, submit }}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplications() {
  const ctx = useContext(ApplicationContext);
  if (!ctx) throw new Error("useApplications must be used within ApplicationProvider");
  return ctx;
}
