import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  Storefront,
  CalendarBlank,
  Buildings,
  CheckCircle,
  Sparkle,
} from "@phosphor-icons/react";
import { getMerchant } from "../data/merchants";
import { RevenueChart } from "../components/RevenueChart";
import { StatTile } from "../components/StatTile";
import { ProgressBar } from "../components/ProgressBar";
import { RiskBadge } from "../components/Badge";
import { Button } from "../components/Button";
import { formatCompactTWD, formatTWD, formatPct, clamp } from "../lib/format";
import { usePortfolio } from "../lib/PortfolioContext";

export function MerchantDetail() {
  const { id } = useParams();
  const merchant = id ? getMerchant(id) : undefined;
  const { invest } = usePortfolio();

  const [amount, setAmount] = useState(5000);
  const [success, setSuccess] = useState(false);

  const min = 1000;
  const max = 200_000;

  if (!merchant) return <Navigate to="/marketplace" replace />;

  const { financing } = merchant;
  const pctFunded = (financing.raised / financing.amount) * 100;
  const remaining = Math.max(financing.amount - financing.raised, 0);

  const handleInvest = () => {
    invest(merchant.id, amount);
    setSuccess(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-4 border-b border-hairline pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-50 text-accent-700">
            <Storefront size={26} weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-ink">{merchant.name}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <Buildings size={15} /> {merchant.city}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarBlank size={15} /> {merchant.founded} 年成立 · {merchant.storefronts} 間門市
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RiskBadge tier={merchant.riskTier} />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-2.5 py-1 text-xs font-medium text-ink-secondary">
            RRS
            <span className="tabular font-mono text-accent-700">{merchant.rrs}</span>
          </span>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Main content */}
        <div className="flex flex-col gap-12">
          <section>
            <h2 className="text-lg font-medium text-ink">數位營收趨勢</h2>
            <p className="mt-1 text-sm text-ink-secondary">
              串接 POS、電子支付與銀行金流，近 12 個月營收表現。
            </p>
            <div className="mt-5 rounded-2xl border border-hairline bg-surface p-5">
              <RevenueChart data={merchant.monthlyRevenue} />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-ink">RBF 融資條件</h2>
            <div className="mt-5 grid grid-cols-2 gap-6 rounded-2xl border border-hairline bg-surface p-6 sm:grid-cols-4">
              <StatTile label="融資金額" value={formatCompactTWD(financing.amount)} />
              <StatTile label="每月營收分潤" value={formatPct(financing.monthlyShareRate * 100)} />
              <StatTile label="最低月還款" value={formatCompactTWD(financing.minMonthlyRepay)} />
              <StatTile
                label="總回收上限"
                value={formatCompactTWD(financing.amount * financing.capMultiple)}
              />
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-ink">資金用途</h2>
            <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-hairline bg-surface p-6">
              {financing.useOfFunds.map((item) => (
                <div key={item.label} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-ink-secondary">{item.label}</span>
                    <span className="tabular text-ink-muted">{item.pct}%</span>
                  </div>
                  <ProgressBar value={item.pct} max={100} />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-ink">投資人專屬權益</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {merchant.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3 text-sm text-ink-secondary">
                  <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-accent-600" />
                  {perk}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-ink">關於這家店</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-secondary">
              {merchant.story}
            </p>
          </section>
        </div>

        {/* Invest panel */}
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="rounded-2xl border border-hairline bg-surface p-6">
            {success ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 text-accent-700">
                  <Sparkle size={24} weight="fill" />
                </div>
                <p className="font-medium text-ink">投資已送出（示範）</p>
                <p className="text-sm text-ink-secondary">
                  你投資了 {formatTWD(amount)} 到 {merchant.name}。
                </p>
                <Link
                  to="/portfolio"
                  className="mt-2 text-sm font-medium text-accent-700 hover:text-accent-800"
                >
                  查看我的投資組合 →
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="tabular font-mono text-ink">
                    已募 {formatCompactTWD(financing.raised)}
                  </span>
                  <span className="text-ink-muted">{formatPct(pctFunded, 0)}</span>
                </div>
                <ProgressBar value={financing.raised} max={financing.amount} className="mt-2" />
                <p className="mt-2 text-xs text-ink-muted">
                  尚需 {formatCompactTWD(remaining)} · {financing.investors} 位投資人已參與
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <StatTile
                    label="預估年化報酬"
                    value={`${financing.expectedAnnualReturn[0]}–${financing.expectedAnnualReturn[1]}%`}
                  />
                  <StatTile
                    label="預估回收期間"
                    value={`${financing.estTermMonths[0]}–${financing.estTermMonths[1]} 個月`}
                  />
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <label htmlFor="amount" className="text-sm font-medium text-ink">
                    投資金額
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-hairline bg-plane px-3 py-2 focus-within:border-accent-400">
                    <span className="text-sm text-ink-muted">NT$</span>
                    <input
                      id="amount"
                      type="number"
                      min={min}
                      max={max}
                      step={1000}
                      value={amount}
                      onChange={(e) =>
                        setAmount(clamp(Number(e.target.value) || 0, min, max))
                      }
                      className="tabular w-full bg-transparent font-mono text-sm text-ink outline-none"
                    />
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={50_000}
                    step={1000}
                    value={Math.min(amount, 50_000)}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="mt-1 accent-accent-600"
                  />
                  <p className="text-xs text-ink-muted">最低投資金額 {formatTWD(min)}</p>
                </div>

                <Button className="mt-6 w-full" size="lg" onClick={handleInvest}>
                  確認投資
                </Button>
                <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-muted">
                  本頁為產品原型示範，不構成真實投資交易或要約。
                </p>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
