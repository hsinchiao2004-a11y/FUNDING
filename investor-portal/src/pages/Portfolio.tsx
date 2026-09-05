import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Wallet, Storefront, TrendUp, Compass } from "@phosphor-icons/react";
import { usePortfolio } from "../lib/PortfolioContext";
import { getMerchant } from "../data/merchants";
import { StatTile } from "../components/StatTile";
import { DemoTag } from "../components/Badge";
import { buttonClasses } from "../components/Button";
import { formatTWD } from "../lib/format";

export function Portfolio() {
  const { holdings, totalInvested } = usePortfolio();

  const merchantsInvested = useMemo(
    () => new Set(holdings.map((h) => h.merchantId)).size,
    [holdings],
  );

  const blendedReturn = useMemo(() => {
    if (holdings.length === 0) return null;
    let weightedLow = 0;
    let weightedHigh = 0;
    for (const h of holdings) {
      const merchant = getMerchant(h.merchantId);
      if (!merchant) continue;
      weightedLow += merchant.financing.expectedAnnualReturn[0] * h.amount;
      weightedHigh += merchant.financing.expectedAnnualReturn[1] * h.amount;
    }
    return [weightedLow / totalInvested, weightedHigh / totalInvested] as const;
  }, [holdings, totalInvested]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <DemoTag className="mb-4 w-fit" />
      <h1 className="text-3xl font-medium tracking-tight text-ink">我的投資組合</h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-secondary">
        投資紀錄僅儲存在本機瀏覽器（示範用途），清除瀏覽資料將會重置。
      </p>

      {holdings.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-hairline py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-accent-700">
            <Compass size={26} weight="duotone" />
          </div>
          <div>
            <p className="font-medium text-ink">還沒有任何投資</p>
            <p className="mt-1 text-sm text-ink-muted">瀏覽商家，開始你的第一筆投資</p>
          </div>
          <Link to="/marketplace" className={buttonClasses("primary", "md")}>
            瀏覽商家
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-6 rounded-2xl border border-hairline bg-surface p-6 sm:grid-cols-4">
            <StatTile
              label="累計投資總額"
              value={formatTWD(totalInvested)}
            />
            <StatTile label="投資商家數" value={merchantsInvested} />
            <StatTile label="投資筆數" value={holdings.length} />
            <StatTile
              label="加權預估年化報酬"
              value={blendedReturn ? `${blendedReturn[0].toFixed(1)}–${blendedReturn[1].toFixed(1)}%` : "—"}
            />
          </div>

          <h2 className="mt-12 text-lg font-medium text-ink">持有明細</h2>
          <div className="mt-5 flex flex-col divide-y divide-hairline rounded-2xl border border-hairline bg-surface">
            {holdings
              .slice()
              .reverse()
              .map((holding, i) => {
                const merchant = getMerchant(holding.merchantId);
                if (!merchant) return null;
                const investedDate = new Date(holding.investedAt);
                return (
                  <Link
                    key={i}
                    to={`/merchants/${merchant.id}`}
                    className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-plane"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                        <Storefront size={18} weight="duotone" />
                      </div>
                      <div>
                        <p className="font-medium text-ink">{merchant.name}</p>
                        <p className="text-xs text-ink-muted">
                          投資於 {investedDate.toLocaleDateString("zh-Hant-TW")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="tabular font-mono text-sm font-medium text-ink">
                          {formatTWD(holding.amount)}
                        </p>
                        <p className="inline-flex items-center gap-1 text-xs text-ink-muted">
                          <TrendUp size={13} />
                          預估 {merchant.financing.expectedAnnualReturn[0]}–{merchant.financing.expectedAnnualReturn[1]}%
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-hairline bg-plane p-4">
            <Wallet size={18} weight="duotone" className="mt-0.5 shrink-0 text-accent-600" />
            <p className="text-xs leading-relaxed text-ink-muted">
              分潤依商家實際月營收提撥，尚未進入回收期的投資會先顯示「等待首期分潤」，此頁面之報酬數字為預估區間，不代表保證收益。
            </p>
          </div>
        </>
      )}
    </div>
  );
}
