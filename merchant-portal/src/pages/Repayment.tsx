import { CheckCircle, Clock } from "@phosphor-icons/react";
import { financing, repaymentHistory, totalRepaid, cap } from "../data/account";
import { RepaymentChart } from "../components/RepaymentChart";
import { StatTile } from "../components/StatTile";
import { ProgressBar } from "../components/ProgressBar";
import { formatCompactTWD, formatPct, formatTWD } from "../lib/format";

export function Repayment() {
  const pctRepaid = (totalRepaid / cap) * 100;
  let cumulative = 0;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">還款與撥款</h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-secondary">
        分潤依實際月營收自動提撥，資金依里程碑分批撥付，不需要手動匯款。
      </p>

      <div className="mt-8 grid grid-cols-2 gap-6 rounded-2xl border border-hairline bg-surface p-6 sm:grid-cols-4">
        <StatTile label="融資金額" value={formatCompactTWD(financing.amount)} />
        <StatTile label="每月營收分潤" value={formatPct(financing.monthlyShareRate * 100)} />
        <StatTile label="最低月還款" value={formatCompactTWD(financing.minMonthlyRepay)} />
        <StatTile label="總回收上限" value={formatCompactTWD(cap)} />
      </div>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-medium text-ink">回收進度</h2>
          <span className="tabular text-sm text-ink-secondary">
            {formatCompactTWD(totalRepaid)} / {formatCompactTWD(cap)}
          </span>
        </div>
        <ProgressBar value={totalRepaid} max={cap} className="mt-3" />
        <p className="mt-2 text-xs text-ink-muted">已完成 {formatPct(pctRepaid, 0)}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-medium text-ink">每月分潤趨勢</h2>
        <div className="mt-5 rounded-2xl border border-hairline bg-surface p-5">
          <RepaymentChart data={repaymentHistory} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-medium text-ink">分潤明細</h2>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-hairline bg-surface">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-hairline text-left text-xs text-ink-muted">
                <th className="px-5 py-3 font-medium">月份</th>
                <th className="px-5 py-3 font-medium">當月營收</th>
                <th className="px-5 py-3 font-medium">當月分潤</th>
                <th className="px-5 py-3 font-medium">累計回收</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {repaymentHistory.map((r) => {
                cumulative += r.dividend;
                return (
                  <tr key={r.month}>
                    <td className="px-5 py-3 text-ink">{r.month}</td>
                    <td className="tabular px-5 py-3 font-mono text-ink-secondary">
                      {formatTWD(r.revenue)}
                    </td>
                    <td className="tabular px-5 py-3 font-mono text-ink">
                      {formatTWD(r.dividend)}
                    </td>
                    <td className="tabular px-5 py-3 font-mono text-ink-secondary">
                      {formatTWD(cumulative)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-medium text-ink">資金撥付里程碑</h2>
        <div className="mt-5 flex flex-col divide-y divide-hairline rounded-2xl border border-hairline bg-surface">
          {financing.useOfFunds.map((m) => (
            <div key={m.label} className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3">
                {m.status === "已撥付" ? (
                  <CheckCircle size={20} weight="fill" className="shrink-0 text-accent-600" />
                ) : (
                  <Clock size={20} weight="fill" className="shrink-0 text-ink-muted" />
                )}
                <div>
                  <p className="font-medium text-ink">{m.label}</p>
                  <p className="text-xs text-ink-muted">{m.pct}% · {m.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="tabular font-mono text-sm font-medium text-ink">
                  {formatTWD(m.amount)}
                </p>
                <p className="text-xs text-ink-muted">{m.status}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
