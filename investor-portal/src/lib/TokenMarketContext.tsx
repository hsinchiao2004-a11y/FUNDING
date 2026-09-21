import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// 平台幣（挺店幣／WPT）兌現轉讓——標的僅為平台幣本身，不綁定任何特定商家的
// 分潤請求權，性質上近似於平台幣與法幣／穩定幣之間的兌換窗口。與 TransferMarketContext
// （轉讓「商家分潤權」，可選擇以 WPT 計價結算）是兩個獨立的機制。

export type CashCurrency = "TWD" | "USDT" | "USDC";
export type TokenListingStatus = "listed" | "completed";

export interface TokenListing {
  id: string;
  wptAmount: number; // 欲兌換之平台幣數量
  askPrice: number; // 意願價格（總價）
  currency: CashCurrency;
  seller: "me" | string;
  status: TokenListingStatus;
  listedAt: string;
}

interface TokenMarketState {
  wptBalance: number;
  listings: TokenListing[];
  listForCash: (wptAmount: number, askPrice: number, currency: CashCurrency) => void;
  cancelListing: (id: string) => void;
  takeListing: (id: string) => void;
}

const TokenMarketContext = createContext<TokenMarketState | null>(null);
const BALANCE_STORAGE_KEY = "wangpu.wpt-balance.v1";
const LISTINGS_STORAGE_KEY = "wangpu.token-listings.v1";

// 示範用初始餘額：模擬投資人先前透過分潤結算或商家合約結清取得、尚未投入
// 特定商家的平台幣。
const SEED_BALANCE = 8_000;

// 示範用：其他投資人掛出的平台幣兌現意向，讓看板一開始就有內容可瀏覽。
const seedListings: TokenListing[] = [
  {
    id: "wpt-seed-1",
    wptAmount: 3_000,
    askPrice: 2_940,
    currency: "TWD",
    seller: "投資人 #2210",
    status: "listed",
    listedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "wpt-seed-2",
    wptAmount: 5_000,
    askPrice: 160,
    currency: "USDT",
    seller: "投資人 #7345",
    status: "listed",
    listedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
];

export function TokenMarketProvider({ children }: { children: ReactNode }) {
  const [wptBalance, setWptBalance] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(BALANCE_STORAGE_KEY);
      return raw ? Number(raw) || 0 : SEED_BALANCE;
    } catch {
      return SEED_BALANCE;
    }
  });

  const [listings, setListings] = useState<TokenListing[]>(() => {
    try {
      const raw = localStorage.getItem(LISTINGS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as TokenListing[]) : seedListings;
    } catch {
      return seedListings;
    }
  });

  useEffect(() => {
    localStorage.setItem(BALANCE_STORAGE_KEY, String(wptBalance));
  }, [wptBalance]);

  useEffect(() => {
    localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(listings));
  }, [listings]);

  // 掛牌兌現：平台幣先從餘額中移出（類似交割前保管），取消掛牌時歸還。
  const listForCash = (wptAmount: number, askPrice: number, currency: CashCurrency) => {
    if (wptAmount <= 0 || wptAmount > wptBalance || askPrice <= 0) return;
    setWptBalance((b) => b - wptAmount);
    setListings((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        wptAmount,
        askPrice,
        currency,
        seller: "me",
        status: "listed",
        listedAt: new Date().toISOString(),
      },
    ]);
  };

  const cancelListing = (id: string) => {
    const listing = listings.find((l) => l.id === id);
    if (!listing || listing.seller !== "me" || listing.status !== "listed") return;
    setWptBalance((b) => b + listing.wptAmount);
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  // 承接他人掛牌：即時完成交割——付出價款（示範用途，不涉及真實金流），
  // 取得平台幣並計入餘額。
  const takeListing = (id: string) => {
    const listing = listings.find((l) => l.id === id);
    if (!listing || listing.seller === "me" || listing.status !== "listed") return;
    setWptBalance((b) => b + listing.wptAmount);
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status: "completed" } : l)));
  };

  return (
    <TokenMarketContext.Provider
      value={{ wptBalance, listings, listForCash, cancelListing, takeListing }}
    >
      {children}
    </TokenMarketContext.Provider>
  );
}

export function useTokenMarket() {
  const ctx = useContext(TokenMarketContext);
  if (!ctx) throw new Error("useTokenMarket must be used within TokenMarketProvider");
  return ctx;
}
