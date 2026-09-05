import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { merchants } from "../data/merchants";

export interface Holding {
  merchantId: string;
  amount: number;
  investedAt: string; // ISO date
}

interface PortfolioState {
  holdings: Holding[];
  invest: (merchantId: string, amount: number) => void;
  totalInvested: number;
}

const PortfolioContext = createContext<PortfolioState | null>(null);
const STORAGE_KEY = "wangpu.portfolio.v1";

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [holdings, setHoldings] = useState<Holding[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Holding[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
  }, [holdings]);

  const invest = (merchantId: string, amount: number) => {
    if (!merchants.some((m) => m.id === merchantId) || amount <= 0) return;
    setHoldings((prev) => [
      ...prev,
      { merchantId, amount, investedAt: new Date().toISOString() },
    ]);
  };

  const totalInvested = useMemo(
    () => holdings.reduce((sum, h) => sum + h.amount, 0),
    [holdings],
  );

  return (
    <PortfolioContext.Provider value={{ holdings, invest, totalInvested }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}
