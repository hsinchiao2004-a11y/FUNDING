import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import clsx from "clsx";
import {
  Storefront,
  CalendarBlank,
  Buildings,
  CheckCircle,
  Lock,
  Sparkle,
  Flag,
  Coins,
} from "@phosphor-icons/react";
import { getMerchant } from "../data/merchants";
import { RevenueChart } from "../components/RevenueChart";
import { StatTile } from "../components/StatTile";
import { ProgressBar } from "../components/ProgressBar";
import { RiskBadge } from "../components/Badge";
import { Button } from "../components/Button";
import { formatCompactTWD, formatTWD, formatPct, formatWpt, twdToWpt, wptToTwd, WPT_RATE_TWD, clamp } from "../lib/format";
import { usePortfolio, type PayoutMode } from "../lib/PortfolioContext";
import { useTokenMarket } from "../lib/TokenMarketContext";

const PAYOUT_MODE_OPTIONS: { value: PayoutMode; label: string; desc: string }[] = [
  { value: "monthly", label: "每月分潤", desc: "每月分潤入帳後，自行選擇提領現金或折抵消費金" },
  { value: "reinvest", label: "每月自動再投資", desc: "每月分潤自動滾入本金，複利累積分潤權" },
  { value: "maturity", label: "到期一次提領", desc: "分潤持續累積，合約到期後一次撥付現金" },
];

export function MerchantDetail() {
  const { id } = useParams();
  const merchant = id ? getMerchant(id) : undefined;
  const { invest } = usePortfolio();
  const { wptBalance, spendWpt } = useTokenMarket();

  // 投資一律以平台幣（WPT）轉入商家專屬合約，因此投資金額的主要輸入單位是
  // WPT；新台幣僅作為換算後的對價顯示，方便理解實際花費。
  const min = 1000;
  const max = 200_000;
  const wptMin = twdToWpt(min);
  const wptMax = twdToWpt(max);

  const [wptAmount, setWptAmount] = useState(twdToWpt(5000));
  const [payoutMode, setPayoutMode] = useState<PayoutMode>("monthly");
  const [success, setSuccess] = useState(false);

  const amount = wptToTwd(wptAmount);
  const insufficientWpt = wptAmount > wptBalance;

  if (!merchant) return <Navigate to="/marketplace" replace />;

  const { financing } = merchant;
  const pctFunded = (financing.raised / financing.amount) * 100;
  const remaining = Math.max(financing.amount - financing.raised, 0);

  const handleInvest = () => {
    if (!spendWpt(wptAmount)) return;
    invest(merchant.id, amount, payoutMode);
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
              <StatTile
                label="融資金額"
                value={formatWpt(twdToWpt(financing.amount))}
                hint={`對價 ${formatCompactTWD(financing.amount)}`}
              />
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
            <h2 className="text-lg font-medium text-ink">分級回饋</h2>
            <p className="mt-1 text-sm text-ink-secondary">依你右側填寫的投資金額，即時解鎖對應權益。</p>
            <ul className="mt-5 flex flex-col gap-3">
              {merchant.rewardTiers.map((tier) => {
                const unlocked = amount >= tier.minAmount;
                return (
                  <li
                    key={tier.label}
                    className={clsx(
                      "flex items-start gap-3 rounded-xl border p-3.5 text-sm transition-colors",
                      unlocked
                        ? "border-accent-200 bg-accent-50 text-ink"
                        : "border-hairline bg-surface text-ink-muted",
                    )}
                  >
                    {unlocked ? (
                      <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-accent-600" />
                    ) : (
                      <Lock size={18} className="mt-0.5 shrink-0 text-ink-muted" />
                    )}
                    <div>
                      <p>{tier.label}</p>
                      {!unlocked && (
                        <p className="mt-0.5 text-xs text-ink-muted">
                          投資滿 {formatWpt(twdToWpt(tier.minAmount))}（對價 {formatTWD(tier.minAmount)}）解鎖
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-ink">商家成長里程碑</h2>
            <p className="mt-1 text-sm text-ink-secondary">
              商家月營收達標後，將解鎖提前還款折讓與投資人優先加碼權。
            </p>
            <div className="mt-5 rounded-2xl border border-hairline bg-surface p-6">
              <div className="flex items-start gap-3">
                <Flag size={20} weight="duotone" className="mt-0.5 shrink-0 text-accent-600" />
                <div className="flex-1">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-ink-secondary">
                      本月營收 {formatCompactTWD(merchant.monthlyRevenue.at(-1)!)}
                    </span>
                    <span className="tabular text-ink-muted">
                      目標 {formatCompactTWD(merchant.growthMilestone.targetMonthlyRevenue)}
                    </span>
                  </div>
                  <ProgressBar
                    value={merchant.monthlyRevenue.at(-1)!}
                    max={merchant.growthMilestone.targetMonthlyRevenue}
                    className="mt-2"
                  />
                  <p className="mt-3 text-sm text-ink-secondary">{merchant.growthMilestone.reward}</p>
                </div>
              </div>
            </div>
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
                  你以 {formatWpt(wptAmount)}（對價 {formatTWD(amount)}）投資了 {merchant.name}，
                  分潤方式：{PAYOUT_MODE_OPTIONS.find((o) => o.value === payoutMode)?.label}。
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
                    已募 {formatWpt(twdToWpt(financing.raised))}
                  </span>
                  <span className="text-ink-muted">{formatPct(pctFunded, 0)}</span>
                </div>
                <p className="text-xs text-ink-muted">對價 {formatCompactTWD(financing.raised)}</p>
                <ProgressBar value={financing.raised} max={financing.amount} className="mt-2" />
                <p className="mt-2 text-xs text-ink-muted">
                  尚需 {formatWpt(twdToWpt(remaining))}（對價 {formatCompactTWD(remaining)}） · {financing.investors} 位投資人已參與
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
                    投資金額（平台幣 WPT）
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-hairline bg-plane px-3 py-2 focus-within:border-accent-400">
                    <Coins size={16} weight="duotone" className="shrink-0 text-accent-600" />
                    <input
                      id="amount"
                      type="number"
                      min={wptMin}
                      max={wptMax}
                      step={1}
                      value={wptAmount}
                      onChange={(e) =>
                        setWptAmount(clamp(Number(e.target.value) || 0, wptMin, wptMax))
                      }
                      className="tabular w-full bg-transparent font-mono text-sm text-ink outline-none"
                    />
                    <span className="shrink-0 text-sm text-ink-muted">WPT</span>
                  </div>
                  <input
                    type="range"
                    min={wptMin}
                    max={50}
                    step={1}
                    value={Math.min(wptAmount, 50)}
                    onChange={(e) => setWptAmount(Number(e.target.value))}
                    className="mt-1 accent-accent-600"
                  />
                  <p className="text-xs text-ink-muted">最低投資金額 {formatWpt(wptMin)}（對價 {formatTWD(min)}）</p>

                  <div className="mt-1 rounded-xl border border-hairline bg-plane px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-ink-secondary">對價（新台幣）</span>
                      <span className="tabular font-mono text-xs font-medium text-ink">{formatTWD(amount)}</span>
                    </div>
                    <p className="mt-0.5 text-right text-[11px] text-ink-muted">
                      1 WPT = {formatTWD(WPT_RATE_TWD)}
                    </p>
                  </div>
                  <p className="text-xs text-ink-muted">
                    我的平台幣餘額 {formatWpt(wptBalance)}
                    {insufficientWpt && (
                      <>
                        ．餘額不足，
                        <Link to="/token-exchange" className="font-medium text-accent-700 hover:text-accent-800">
                          前往兌換平台幣 →
                        </Link>
                      </>
                    )}
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <span className="text-sm font-medium text-ink">分潤方式</span>
                  <div className="flex flex-col gap-2">
                    {PAYOUT_MODE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPayoutMode(opt.value)}
                        className={clsx(
                          "flex flex-col items-start gap-0.5 rounded-xl border p-3 text-left transition-colors",
                          payoutMode === opt.value
                            ? "border-accent-400 bg-accent-50"
                            : "border-hairline bg-plane hover:border-accent-300",
                        )}
                      >
                        <span className="text-sm font-medium text-ink">{opt.label}</span>
                        <span className="text-xs text-ink-muted">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button className="mt-6 w-full" size="lg" onClick={handleInvest} disabled={insufficientWpt}>
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
