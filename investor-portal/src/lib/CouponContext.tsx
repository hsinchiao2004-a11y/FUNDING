import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface Coupon {
  id: string;
  merchantId: string;
  offer: string;
  claimed: boolean;
  status: "unused" | "used";
}

interface CouponState {
  coupons: Coupon[];
  claim: (id: string) => void;
  markUsed: (id: string) => void;
}

const CouponContext = createContext<CouponState | null>(null);
const STORAGE_KEY = "wangpu.coupons.v2";

// 示範用：商家提供給投資人的到店優惠，可直接在「優惠券」頁領取，不需透過通知。
const seedCoupons: Coupon[] = [
  { id: "c1", merchantId: "brew-and-bloom", offer: "投資人專屬 9 折會員卡", claimed: false, status: "unused" },
  { id: "c2", merchantId: "noodle-house", offer: "招待券：加點滷味一份", claimed: false, status: "unused" },
  { id: "c3", merchantId: "riverside-pizza", offer: "到店消費享 9 折", claimed: false, status: "unused" },
  { id: "c4", merchantId: "goodgrain", offer: "選品消費滿額贈小禮", claimed: false, status: "unused" },
];

export function CouponProvider({ children }: { children: ReactNode }) {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Coupon[]) : seedCoupons;
    } catch {
      return seedCoupons;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
  }, [coupons]);

  const claim = (id: string) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, claimed: true } : c)));
  };

  const markUsed = (id: string) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, status: "used" } : c)));
  };

  return (
    <CouponContext.Provider value={{ coupons, claim, markUsed }}>
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupons() {
  const ctx = useContext(CouponContext);
  if (!ctx) throw new Error("useCoupons must be used within CouponProvider");
  return ctx;
}
