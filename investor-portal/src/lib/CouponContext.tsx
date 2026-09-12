import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface Coupon {
  id: string;
  merchantId: string;
  offer: string;
  message: string;
  status: "unused" | "used";
  receivedAt: string;
}

interface CouponState {
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, "status" | "receivedAt">) => void;
  markUsed: (id: string) => void;
}

const CouponContext = createContext<CouponState | null>(null);
const STORAGE_KEY = "wangpu.coupons.v1";

export function CouponProvider({ children }: { children: ReactNode }) {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Coupon[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
  }, [coupons]);

  const addCoupon: CouponState["addCoupon"] = (coupon) => {
    setCoupons((prev) => {
      if (prev.some((c) => c.id === coupon.id)) return prev; // 避免重複加入同一張
      return [...prev, { ...coupon, status: "unused", receivedAt: new Date().toISOString() }];
    });
  };

  const markUsed = (id: string) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, status: "used" } : c)));
  };

  return (
    <CouponContext.Provider value={{ coupons, addCoupon, markUsed }}>
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupons() {
  const ctx = useContext(CouponContext);
  if (!ctx) throw new Error("useCoupons must be used within CouponProvider");
  return ctx;
}
