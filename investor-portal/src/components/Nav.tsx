import { useState } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { List, X } from "@phosphor-icons/react";
import { buttonClasses } from "./Button";

const links = [
  { to: "/marketplace", label: "瀏覽商家" },
  { to: "/portfolio", label: "我的投資" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-plane/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <NavLink to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
            <rect width="32" height="32" rx="8" fill="#059669" />
            <rect x="7" y="17" width="4" height="9" rx="1.5" fill="#ecfdf5" />
            <rect x="14" y="12" width="4" height="14" rx="1.5" fill="#ecfdf5" />
            <rect x="21" y="6" width="4" height="20" rx="1.5" fill="#ecfdf5" />
          </svg>
          <span className="text-[15px] font-medium tracking-tight text-ink">旺舖</span>
        </NavLink>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                clsx(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent-50 text-accent-700"
                    : "text-ink-secondary hover:text-ink",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NavLink to="/marketplace" className={buttonClasses("primary", "md")}>
            開始投資
          </NavLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "關閉選單" : "開啟選單"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-ink-secondary sm:hidden"
          >
            {open ? <X size={18} /> : <List size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-hairline px-6 py-3 sm:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent-50 text-accent-700"
                    : "text-ink-secondary hover:bg-surface hover:text-ink",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
