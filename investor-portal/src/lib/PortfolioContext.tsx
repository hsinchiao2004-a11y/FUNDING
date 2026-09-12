import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getMerchant, merchants } from "../data/merchants";
import { clamp } from "./format";

export interface Holding {
  merchantId: string;
  amount: number;
  investedAt: string; // ISO date
  accruedDividend: number; // 已入帳、尚未提領或折抵的分潤
}

export interface StoreCredit {
  merchantId: string;
  amount: number; // 可用消費金餘額
}

interface PortfolioState {
  holdings: Holding[];
  storeCredits: StoreCredit[];
  totalCashWithdrawn: number;
  invest: (merchantId: string, amount: number) => void;
  removeHoldingAt: (index: number) => void;
  addHolding: (merchantId: string, amount: number) => void;
  redeemCash: (index: number) => void;
  redeemAsCredit: (index: number) => void;
  totalInvested: number;
  totalAccruedDividend: number;
}

const PortfolioContext = createContext<PortfolioState | null>(null);
const STORAGE_KEY = "wangpu.portfolio.v1";
const CREDIT_STORAGE_KEY = "wangpu.store-credits.v1";
const WITHDRAWN_STORAGE_KEY = "wangpu.cash-withdrawn.v1";

// 示範用：投資成立後，模擬一筆已入帳的分潤（金額的 2%–5%），讓分潤運用功能一開始就有東西可互動。
const seedAccrual = (amount: number) => Math.round((amount * (0.02 + Math.random() * 0.03)) / 100) * 100;

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [holdings, setHoldings] = useState<Holding[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Array<Partial<Holding> & { merchantId: string; amount: number; investedAt: string }>;
      return parsed.map((h) => ({ ...h, accruedDividend: h.accruedDividend ?? 0 }));
    } catch {
      return [];
    }
  });

  const [storeCredits, setStoreCredits] = useState<StoreCredit[]>(() => {
    try {
      const raw = localStorage.getItem(CREDIT_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StoreCredit[]) : [];
    } catch {
      return [];
    }
  });

  const [totalCashWithdrawn, setTotalCashWithdrawn] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(WITHDRAWN_STORAGE_KEY);
      return raw ? Number(raw) || 0 : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    localStorage.setItem(CREDIT_STORAGE_KEY, JSON.stringify(storeCredits));
  }, [storeCredits]);

  useEffect(() => {
    localStorage.setItem(WITHDRAWN_STORAGE_KEY, String(totalCashWithdrawn));
  }, [totalCashWithdrawn]);

  const invest = (merchantId: string, amount: number) => {
    if (!merchants.some((m) => m.id === merchantId) || amount <= 0) return;
    setHoldings((prev) => [
      ...prev,
      { merchantId, amount, investedAt: new Date().toISOString(), accruedDividend: seedAccrual(amount) },
    ]);
  };

  // Used when a holding is listed on the transfer-intent board (pulled out of
  // the active portfolio while the listing is pending / matched).
  const removeHoldingAt = (index: number) => {
    setHoldings((prev) => prev.filter((_, i) => i !== index));
  };

  // Used when a transfer-intent listing is cancelled (give the holding back),
  // or when a platform-matched transfer completes (credit the buyer side).
  const addHolding = (merchantId: string, amount: number) => {
    setHoldings((prev) => [
      ...prev,
      { merchantId, amount, investedAt: new Date().toISOString(), accruedDividend: seedAccrual(amount) },
    ]);
  };

  // Each redeem action reads the current snapshot from the closure and fires
  // independent, pure state updates — nesting a setStoreCredits call inside
  // setHoldings' updater would double-fire it under StrictMode's dev-mode
  // double-invocation of updater functions.
  const redeemCash = (index: number) => {
    const holding = holdings[index];
    if (!holding || holding.accruedDividend <= 0) return;
    setTotalCashWithdrawn((t) => t + holding.accruedDividend);
    setHoldings((prev) => prev.map((h, i) => (i === index ? { ...h, accruedDividend: 0 } : h)));
  };

  const redeemAsCredit = (index: number) => {
    const holding = holdings[index];
    if (!holding || holding.accruedDividend <= 0) return;
    const boostRate = getMerchant(holding.merchantId)?.financing.creditBoostRate ?? 1;
    const creditAmount = Math.round(holding.accruedDividend * boostRate);
    setStoreCredits((prevCredits) => {
      const existing = prevCredits.find((c) => c.merchantId === holding.merchantId);
      if (existing) {
        return prevCredits.map((c) =>
          c.merchantId === holding.merchantId ? { ...c, amount: c.amount + creditAmount } : c,
        );
      }
      return [...prevCredits, { merchantId: holding.merchantId, amount: creditAmount }];
    });
    setHoldings((prev) => prev.map((h, i) => (i === index ? { ...h, accruedDividend: 0 } : h)));
  };

  const totalInvested = useMemo(
    () => holdings.reduce((sum, h) => sum + h.amount, 0),
    [holdings],
  );

  const totalAccruedDividend = useMemo(
    () => holdings.reduce((sum, h) => sum + clamp(h.accruedDividend, 0, Infinity), 0),
    [holdings],
  );

  return (
    <PortfolioContext.Provider
      value={{
        holdings,
        storeCredits,
        totalCashWithdrawn,
        invest,
        removeHoldingAt,
        addHolding,
        redeemCash,
        redeemAsCredit,
        totalInvested,
        totalAccruedDividend,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}
