import { Link } from "react-router-dom";
import { ArrowUpRight, Storefront } from "@phosphor-icons/react";
import type { Merchant } from "../data/merchants";
import { RiskBadge } from "./Badge";
import { ProgressBar } from "./ProgressBar";
import { formatCompactTWD, formatPct, formatWpt, twdToWpt } from "../lib/format";

export function MerchantCard({ merchant }: { merchant: Merchant }) {
  const { financing } = merchant;
  const pctFunded = (financing.raised / financing.amount) * 100;

  return (
    <Link
      to={`/merchants/${merchant.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-hairline bg-surface p-5 transition-colors hover:border-accent-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
            <Storefront size={20} weight="duotone" />
          </div>
          <div>
            <h3 className="font-medium text-ink">{merchant.name}</h3>
            <p className="text-xs text-ink-muted">
              {merchant.category} · {merchant.city}
            </p>
          </div>
        </div>
        <ArrowUpRight
          size={18}
          className="mt-1 shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-600"
        />
      </div>

      <p className="line-clamp-2 text-sm text-ink-secondary">{merchant.story}</p>

      <div className="flex flex-wrap items-center gap-2">
        <RiskBadge tier={merchant.riskTier} />
        <span className="text-xs text-ink-muted">RRS {merchant.rrs}</span>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <div className="flex items-baseline justify-between text-sm">
          <span className="tabular font-mono text-ink">
            已募 {formatWpt(twdToWpt(financing.raised))}
          </span>
          <span className="text-ink-muted">{formatPct(pctFunded, 0)}</span>
        </div>
        <p className="text-xs text-ink-muted">對價 {formatCompactTWD(financing.raised)}</p>
        <ProgressBar value={financing.raised} max={financing.amount} />
        <div className="flex items-baseline justify-between pt-1 text-xs text-ink-muted">
          <span>預估年化 {financing.expectedAnnualReturn[0]}–{financing.expectedAnnualReturn[1]}%</span>
          <span>{financing.investors} 位投資人</span>
        </div>
      </div>
    </Link>
  );
}
