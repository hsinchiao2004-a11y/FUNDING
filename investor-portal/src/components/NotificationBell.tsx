import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Megaphone, Ticket, CheckCircle } from "@phosphor-icons/react";
import { useNotifications } from "../lib/NotificationContext";
import { useCoupons } from "../lib/CouponContext";
import { getMerchant } from "../data/merchants";
import { Button } from "./Button";

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead, markClaimed } = useNotifications();
  const { addCoupon } = useCoupons();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) markAllRead();
  };

  const claim = (id: string, merchantId: string, offer: string, message: string) => {
    addCoupon({ id, merchantId, offer, message });
    markClaimed(id);
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label="通知"
        aria-expanded={open}
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline text-ink-secondary transition-colors hover:text-ink sm:h-10 sm:w-10"
      >
        <Bell size={17} weight={unreadCount > 0 ? "fill" : "regular"} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-status-critical sm:right-1.5 sm:top-1.5" aria-hidden />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[22rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-hairline bg-surface p-2 shadow-xl shadow-ink/10">
          <div className="flex items-center gap-2 px-3 py-2">
            <Megaphone size={15} weight="duotone" className="text-accent-600" />
            <p className="text-xs font-medium text-ink-secondary">促購 Agent 通知</p>
          </div>
          {notifications.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-ink-muted">目前沒有通知</p>
          ) : (
            <div className="flex flex-col gap-2">
              {notifications.map((n) => {
                const merchant = getMerchant(n.merchantId);
                if (!merchant) return null;
                return (
                  <div key={n.id} className="rounded-xl border border-hairline bg-plane p-3.5">
                    <p className="text-sm leading-relaxed text-ink">{n.message}</p>
                    <div className="mt-3 flex items-center gap-2">
                      {n.claimed ? (
                        <>
                          <span className="inline-flex items-center gap-1.5 text-sm text-accent-700">
                            <CheckCircle size={15} weight="fill" />
                            已加入
                          </span>
                          <Link
                            to="/coupons"
                            className="text-sm font-medium text-accent-700 hover:text-accent-800"
                          >
                            前往我的優惠票券 →
                          </Link>
                        </>
                      ) : (
                        <Button size="md" onClick={() => claim(n.id, n.merchantId, n.offer, n.message)}>
                          <Ticket size={14} />
                          加入優惠票券
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
