import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type IntentStatus = "listed" | "pending_review" | "completed";

export interface TransferIntent {
  id: string;
  merchantId: string;
  amount: number; // 面額（原始分潤權金額）
  askPrice: number; // 轉讓方希望取得的價金
  seller: "me" | string; // "me"，或示範用的其他投資人代稱
  status: IntentStatus;
  listedAt: string;
}

interface TransferMarketState {
  intents: TransferIntent[];
  addIntent: (intent: Omit<TransferIntent, "id" | "listedAt" | "status">) => void;
  removeIntent: (id: string) => void;
  updateStatus: (id: string, status: IntentStatus) => void;
}

const TransferMarketContext = createContext<TransferMarketState | null>(null);
const STORAGE_KEY = "wangpu.transfer-intents.v1";

// 示範用的其他投資人意向掛牌，讓看板一開始就有內容可以瀏覽。
const seedIntents: TransferIntent[] = [
  {
    id: "seed-1",
    merchantId: "goodgrain",
    amount: 30_000,
    askPrice: 29_000,
    seller: "投資人 #3921",
    status: "listed",
    listedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "seed-2",
    merchantId: "noodle-house",
    amount: 50_000,
    askPrice: 51_500,
    seller: "投資人 #1084",
    status: "listed",
    listedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "seed-3",
    merchantId: "atelier-soap",
    amount: 15_000,
    askPrice: 14_200,
    seller: "投資人 #5577",
    status: "listed",
    listedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

export function TransferMarketProvider({ children }: { children: ReactNode }) {
  const [intents, setIntents] = useState<TransferIntent[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as TransferIntent[]) : seedIntents;
    } catch {
      return seedIntents;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(intents));
  }, [intents]);

  const addIntent: TransferMarketState["addIntent"] = (intent) => {
    setIntents((prev) => [
      ...prev,
      { ...intent, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, status: "listed", listedAt: new Date().toISOString() },
    ]);
  };

  const removeIntent = (id: string) => {
    setIntents((prev) => prev.filter((i) => i.id !== id));
  };

  const updateStatus = (id: string, status: IntentStatus) => {
    setIntents((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  return (
    <TransferMarketContext.Provider value={{ intents, addIntent, removeIntent, updateStatus }}>
      {children}
    </TransferMarketContext.Provider>
  );
}

export function useTransferMarket() {
  const ctx = useContext(TransferMarketContext);
  if (!ctx) throw new Error("useTransferMarket must be used within TransferMarketProvider");
  return ctx;
}
