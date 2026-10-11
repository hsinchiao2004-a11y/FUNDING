import { createContext, useContext, useState, type ReactNode } from "react";
import { merchants, type Merchant } from "../data/merchants";

export interface AgentNotification {
  id: string;
  merchantId: string;
  offer: string; // 優惠內容，例如「到店消費享 9 折」
  message: string;
  read: boolean;
  claimed: boolean; // 是否已加入優惠票券專區
  sentAt: string;
}

interface NotificationState {
  notifications: AgentNotification[];
  unreadCount: number;
  markAllRead: () => void;
  markClaimed: (id: string) => void;
}

const NotificationContext = createContext<NotificationState | null>(null);

// 「投資人變消費者」促購 Agent 的核心觸發條件：偵測到投資商家營收較上月下滑
// ——不是憑空挑一家商家講「好久不見」，而是真的從 monthlyRevenue 比對月增
// 減算出來。示範用途：以此生成一筆到店優惠通知，讓功能一開始就有東西可看。
const hasRevenueDip = (m: Merchant) => {
  const rev = m.monthlyRevenue;
  return rev.length >= 2 && rev[rev.length - 1] < rev[rev.length - 2];
};

function buildSeedNotifications(): AgentNotification[] {
  // 優先挑已被三方資料勾稽標記黃燈／紅燈、同時營收也下滑的商家，讓警示與
  // 促購通知指向同一家店，示範畫面彼此呼應；若沒有同時符合兩項的商家，
  // 退而求其次單純依營收下滑判斷。
  const declining =
    merchants.find((m) => m.alertLevel !== "ok" && hasRevenueDip(m)) ?? merchants.find(hasRevenueDip);
  if (!declining) return [];

  return [
    {
      id: `n-${declining.id}`,
      merchantId: declining.id,
      offer: "到店消費享 9 折",
      message: `${declining.name} 本月營收較上月下滑，身為投資人的你，這週到店消費即可享專屬 9 折優惠，順便親自看看店裡最近的狀況，也歡迎分享給朋友一起支持 😊`,
      read: false,
      claimed: false,
      sentAt: new Date().toISOString(),
    },
  ];
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AgentNotification[]>(buildSeedNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markClaimed = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, claimed: true } : n)));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, markClaimed }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
