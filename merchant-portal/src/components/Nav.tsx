import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { Storefront } from "@phosphor-icons/react";
import { profile } from "../data/account";

const links = [
  { to: "/", label: "總覽", end: true },
  { to: "/apply", label: "申請融資" },
  { to: "/repayment", label: "還款與撥款" },
  { to: "/connections", label: "資料來源" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-plane/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
            <rect width="32" height="32" rx="8" fill="#059669" />
            <rect x="7" y="17" width="4" height="9" rx="1.5" fill="#ecfdf5" />
            <rect x="14" y="12" width="4" height="14" rx="1.5" fill="#ecfdf5" />
            <rect x="21" y="6" width="4" height="20" rx="1.5" fill="#ecfdf5" />
          </svg>
          <span className="text-[15px] font-medium tracking-tight text-ink">挺店商家後台</span>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
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

        <div className="flex items-center gap-2 rounded-full border border-hairline bg-surface py-1 pl-1 pr-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-50 text-accent-700">
            <Storefront size={14} weight="duotone" />
          </div>
          <span className="hidden text-sm font-medium text-ink sm:inline">{profile.name}</span>
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-hairline px-4 py-2 lg:hidden">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              clsx(
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
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
    </header>
  );
}
