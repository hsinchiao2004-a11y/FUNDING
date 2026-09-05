import { motion } from "motion/react";
import { TrendUp, Storefront } from "@phosphor-icons/react";
import { merchants } from "../data/merchants";
import { formatCompactTWD } from "../lib/format";
import { ProgressBar } from "./ProgressBar";
import { RiskBadge } from "./Badge";

const featured = merchants[0];

export function HeroPreview() {
  const pctFunded = (featured.financing.raised / featured.financing.amount) * 100;

  return (
    <div className="relative mx-auto w-full max-w-md py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full rounded-2xl border border-hairline bg-surface p-5 shadow-xl shadow-ink/5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
            <Storefront size={18} weight="duotone" />
          </div>
          <div>
            <p className="text-sm font-medium text-ink">{featured.name}</p>
            <p className="text-xs text-ink-muted">{featured.category} · {featured.city}</p>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-ink-muted">本月營收</p>
            <p className="tabular font-mono text-xl font-medium text-ink">
              {formatCompactTWD(featured.monthlyRevenue.at(-1)!)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <RiskBadge tier={featured.riskTier} />
            <span className="text-[11px] text-ink-muted">
              RRS <span className="tabular font-mono font-medium text-accent-700">{featured.rrs}</span>
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-end gap-0.5" aria-hidden>
          {featured.monthlyRevenue.slice(-8).map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-accent-200"
              style={{ height: `${16 + (v / Math.max(...featured.monthlyRevenue)) * 40}px` }}
            />
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-ink-muted">募資進度</span>
            <span className="tabular text-ink-secondary">{pctFunded.toFixed(0)}%</span>
          </div>
          <ProgressBar value={featured.financing.raised} max={featured.financing.amount} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: -10 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -top-4 -left-4 flex items-center gap-2 rounded-xl border border-hairline bg-surface px-3 py-2 shadow-lg shadow-ink/5 sm:-left-8"
      >
        <TrendUp size={16} weight="bold" className="text-accent-600" />
        <span className="tabular font-mono text-xs font-medium text-ink">
          本月分潤 +{formatCompactTWD(46000)}
        </span>
      </motion.div>
    </div>
  );
}
