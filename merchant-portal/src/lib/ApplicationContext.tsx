import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface Application {
  amount: number;
  allocation: { label: string; pct: number }[];
  shareRatePct: number; // 商家於核准後自行設定的每月營收分潤比例
  rewardOffers: string[]; // 商家於核准後自行設定的投資人回饋方式
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
