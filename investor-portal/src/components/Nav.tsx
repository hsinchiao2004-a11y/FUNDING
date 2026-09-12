import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { ArrowsLeftRight } from "@phosphor-icons/react";
import { buttonClasses } from "./Button";
import { NotificationBell } from "./NotificationBell";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-plane/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6">
        <NavLink to="/" className="flex shrink-0 items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
            <rect width="32" height="32" rx="8" fill="#059669" />
            <rect x="7" y="17" width="4" height="9" rx="1.5" fill="#ecfdf5" />
            <rect x="14" y="12" width="4" height="14" rx="1.5" fill="#ecfdf5" />
            <rect x="21" y="6" width="4" height="20" rx="1.5" fill="#ecfdf5" />
          </svg>
          <span className="text-[15px] font-medium tracking-tight text-ink">旺舖</span>
        </NavLink>

        <div className="flex items-center gap-0.5 sm:gap-2">
          <NavLink
            to="/transfers"
            aria-label="轉讓看板"
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-2 text-sm font-medium transition-colors sm:px-4",
                isActive ? "bg-accent-50 text-accent-700" : "text-ink-secondary hover:text-ink",
              )
            }
          >
            <ArrowsLeftRight size={16} />
            <span className="hidden sm:inline">轉讓看板</span>
          </NavLink>
          <NavLink
            to="/marketplace"
            className={({ isActive }) =>
              clsx(
                buttonClasses("primary", "md"),
                "!px-2.5 sm:!px-5",
                isActive && "ring-2 ring-accent-800 ring-offset-2 ring-offset-plane",
              )
            }
          >
            開始投資
          </NavLink>
          <NavLink
            to="/portfolio"
            className={({ isActive }) =>
              clsx(
                buttonClasses("primary", "md"),
                "!px-2.5 sm:!px-5",
                isActive && "ring-2 ring-accent-800 ring-offset-2 ring-offset-plane",
              )
            }
          >
            我的投資
          </NavLink>
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}
