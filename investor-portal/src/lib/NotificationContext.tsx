import { createContext, useContext, useState, type ReactNode } from "react";

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

// 「投資人變消費者」促購 Agent 的產出：偵測到投資商家營收不如預期時自動生成的邀請消費通知（情境示範）。
const seedNotifications: AgentNotification[] = [
  {
    id: "n1",
    merchantId: "riverside-pizza",
    offer: "到店消費享 9 折",
    message:
      "好久不見！河岸柴燒披薩最近推出新菜單，身為投資人的你享有專屬優惠——這週到店消費享 9 折，順便看看你投資的店最近的樣子 😊",
    read: false,
    claimed: false,
    sentAt: new Date().toISOString(),
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AgentNotification[]>(seedNotifications);

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
