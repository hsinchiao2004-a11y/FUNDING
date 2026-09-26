import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Wallet, Storefront, TrendUp, Compass, Coins, Ticket, ArrowsLeftRight, Robot, ArrowsClockwise, FastForward } from "@phosphor-icons/react";
import { usePortfolio, type PayoutMode } from "../lib/PortfolioContext";
import { getMerchant } from "../data/merchants";
import { StatTile } from "../components/StatTile";
import { Button, buttonClasses } from "../components/Button";
import { formatTWD, formatWpt, twdToWpt } from "../lib/format";

const payoutModeLabel: Record<PayoutMode, string> = {
  monthly: "每月分潤",
  reinvest: "每月自動再投資",
  maturity: "到期一次提領",
};

export function Portfolio() {
  const {
    holdings,
    storeCredits,
    totalCashWithdrawn,
    totalInvested,
    totalAccruedDividend,
    totalReinvested,
    redeemCash,
    redeemAsCredit,
    reinvest,
    simulateMonthlyCycle,
    cyclesCompleted,
  } = usePortfolio();

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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-ink">我的投資組合</h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-secondary">
            投資紀錄僅儲存在本機瀏覽器（示範用途），清除瀏覽資料將會重置。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/transfers" className={buttonClasses("ghost", "md")}>
            <ArrowsLeftRight size={15} /> 前往轉讓看板
          </Link>
          <Link to="/agents" className={buttonClasses("ghost", "md")}>
            <Robot size={15} /> AI 風險監測與建議
          </Link>
        </div>
      </div>

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
              value={formatWpt(twdToWpt(totalInvested))}
              hint={`對價 ${formatTWD(totalInvested)}`}
            />
            <StatTile label="投資商家數" value={merchantsInvested} />
            <StatTile label="投資筆數" value={holdings.length} />
            <StatTile
              label="加權預估年化報酬"
              value={blendedReturn ? `${blendedReturn[0].toFixed(1)}–${blendedReturn[1].toFixed(1)}%` : "—"}
            />
          </div>

          {(totalAccruedDividend > 0 || totalCashWithdrawn > 0 || totalReinvested > 0 || storeCredits.length > 0) && (
            <section id="dividend-summary" className="mt-10 scroll-mt-6">
              <h2 className="text-lg font-medium text-ink">分潤總覽</h2>
              <p className="mt-1 text-sm text-ink-secondary">
                分潤可以提領現金、折抵為到店消費金（加碼比例依各商家而異），或滾入同一筆持股自動再投資，
                複利累積分潤——不必自己提領後再手動重新投資一次。
              </p>
              <div className="mt-4 grid grid-cols-2 gap-6 rounded-2xl border border-hairline bg-surface p-6 sm:grid-cols-4">
                <StatTile label="可運用分潤（尚未提領）" value={formatTWD(totalAccruedDividend)} />
                <StatTile label="累計已提領現金" value={formatTWD(totalCashWithdrawn)} />
                <StatTile label="累計滾入再投資" value={formatTWD(totalReinvested)} />
                <StatTile
                  label="消費金餘額"
                  value={formatTWD(storeCredits.reduce((sum, c) => sum + c.amount, 0))}
                />
              </div>

              {storeCredits.length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                  {storeCredits.map((credit) => {
                    const merchant = getMerchant(credit.merchantId);
                    if (!merchant) return null;
                    return (
                      <div
                        key={credit.merchantId}
                        className="flex items-center justify-between rounded-xl border border-hairline bg-plane px-4 py-2.5"
                      >
                        <span className="inline-flex items-center gap-2 text-sm text-ink-secondary">
                          <Ticket size={15} weight="duotone" className="text-accent-600" />
                          {merchant.name} 消費金
                        </span>
                        <span className="tabular font-mono text-sm font-medium text-ink">
                          {formatTWD(credit.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          <div className="mt-12 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-medium text-ink">持有明細</h2>
            <Button variant="ghost" size="md" onClick={simulateMonthlyCycle}>
              <FastForward size={14} />
              模擬下一期分潤入帳（示範）
            </Button>
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            實際上線後分潤依商家每月營收自動入帳，本頁以此按鈕模擬時間經過，方便示範分潤相關功能。
          </p>
          <div className="mt-5 flex flex-col divide-y divide-hairline rounded-2xl border border-hairline bg-surface">
            {holdings.map((holding, i) => {
              const merchant = getMerchant(holding.merchantId);
              if (!merchant) return null;
              const investedDate = new Date(holding.investedAt);
              return (
                <div key={i} className="flex flex-col gap-4 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <Link
                      to={`/merchants/${merchant.id}`}
                      className="flex items-center gap-3 hover:opacity-80"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                        <Storefront size={18} weight="duotone" />
                      </div>
                      <div>
                        <p className="font-medium text-ink">{merchant.name}</p>
                        <p className="text-xs text-ink-muted">
                          投資於 {investedDate.toLocaleDateString("zh-Hant-TW")} ·{" "}
                          {payoutModeLabel[holding.payoutMode]}
                        </p>
                      </div>
                    </Link>
                    <div className="text-right">
                      <p className="tabular font-mono text-sm font-medium text-ink">
                        {formatWpt(twdToWpt(holding.amount))}
                      </p>
                      <p className="text-xs text-ink-muted">對價 {formatTWD(holding.amount)}</p>
                      <p className="inline-flex items-center gap-1 text-xs text-ink-muted">
                        <TrendUp size={13} />
                        預估 {merchant.financing.expectedAnnualReturn[0]}–{merchant.financing.expectedAnnualReturn[1]}%
                      </p>
                    </div>
                  </div>

                  {holding.accruedDividend > 0 ? (
                    <div className="flex flex-col gap-2.5 rounded-xl border border-hairline bg-plane p-3.5 sm:flex-row sm:items-center sm:justify-between">
                      <span className="inline-flex items-center gap-1.5 text-sm text-ink-secondary">
                        <Coins size={15} weight="duotone" className="text-accent-600" />
                        本筆已入帳分潤 <span className="tabular font-mono text-ink">{formatTWD(holding.accruedDividend)}</span>
                      </span>
                      {holding.payoutMode === "maturity" ? (
                        <span className="text-xs text-ink-muted">已鎖定至合約到期，屆時一次撥付現金</span>
                      ) : holding.payoutMode === "reinvest" ? (
                        <Button size="md" onClick={() => reinvest(i)}>
                          <ArrowsClockwise size={14} />
                          滾入再投資
                        </Button>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <Button variant="ghost" size="md" onClick={() => redeemCash(i)}>
                            提領現金
                          </Button>
                          <Button variant="ghost" size="md" onClick={() => reinvest(i)}>
                            <ArrowsClockwise size={14} />
                            滾入再投資
                          </Button>
                          <Button size="md" onClick={() => redeemAsCredit(i)}>
                            折抵消費金 (+{Math.round((merchant.financing.creditBoostRate - 1) * 100)}%)
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : holding.payoutMode === "reinvest" ? (
                    <p className="text-xs text-ink-muted">
                      {cyclesCompleted > 0
                        ? "每期分潤已自動滾入本金，累計滾入金額請見上方「分潤總覽」。"
                        : "尚未進入分潤週期，下一期分潤入帳後會自動滾入本金，不需手動操作。"}
                    </p>
                  ) : cyclesCompleted === 0 ? (
                    <p className="text-xs text-ink-muted">尚未進入分潤週期，下一期分潤入帳後會出現在這裡。</p>
                  ) : (
                    <p className="text-xs text-ink-muted">
                      本期分潤已處理完畢——提領現金、滾入再投資或折抵消費金的紀錄請見上方
                      <a href="#dividend-summary" className="font-medium text-accent-700 hover:text-accent-800">
                        「分潤總覽」
                      </a>
                      ，下一期分潤入帳後會再出現在這裡。
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-hairline bg-plane p-4">
            <Wallet size={18} weight="duotone" className="mt-0.5 shrink-0 text-accent-600" />
            <p className="text-xs leading-relaxed text-ink-muted">
              分潤依商家實際月營收提撥，尚未進入回收期的投資會先顯示「等待首期分潤」，此頁面之報酬數字與已入帳分潤均為示範用途，不代表保證收益。
            </p>
          </div>
        </>
      )}
    </div>
  );
}
