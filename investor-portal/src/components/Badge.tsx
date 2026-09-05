import clsx from "clsx";
import type { RiskTier } from "../data/merchants";

const riskConfig: Record<RiskTier, { label: string; className: string }> = {
  low: { label: "營收穩定", className: "bg-status-good/10 text-[#0ca30c]" },
  medium: { label: "營收成長中", className: "bg-status-warning/15 text-[#946200]" },
  elevated: { label: "波動較高", className: "bg-status-serious/15 text-[#a5401f]" },
};

export function RiskBadge({ tier }: { tier: RiskTier }) {
  const cfg = riskConfig[tier];
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        cfg.className,
      )}
    >
      {cfg.label}
    </span>
  );
}

export function DemoTag({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-muted",
        className,
      )}
    >
      示範資料 · 非真實商家
    </span>
  );
}
