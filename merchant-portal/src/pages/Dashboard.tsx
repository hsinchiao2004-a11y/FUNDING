import { useState } from "react";
import { Link } from "react-router-dom";
import { TrendUp, Lightbulb, Warning, Megaphone, ArrowRight } from "@phosphor-icons/react";
import {
  profile,
  rrs,
  monthlyRevenue,
  financing,
  totalRepaid,
  cap,
  dataSources,
  aiSuggestions,
} from "../data/account";
import { RevenueChart } from "../components/RevenueChart";
import { StatTile } from "../components/StatTile";
import { ProgressBar } from "../components/ProgressBar";
import { Pill } from "../components/Badge";
import { Button } from "../components/Button";
import { formatCompactTWD, formatPct } from "../lib/format";

const suggestionIcon = { positive: TrendUp, info: Lightbulb, warning: Warning, promo: Megaphone };
const suggestionTone = { positive: "good", info: "info", warning: "warning", promo: "info" } as const;
const suggestionLabel = { positive: "正向訊號", info: "小提醒", warning: "建議處理", promo: "促購建議" } as const;

export function Dashboard() {
  const connectedCount = dataSources.filter((d) => d.connected).length;
  const pctRepaid = (totalRepaid / cap) * 100;
  const [adoptedPromos, setAdoptedPromos] = useState<Set<string>>(new Set());

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div>
        <p className="text-sm text-ink-muted">{profile.category} · {profile.city}</p>
        <h1 className="mt-1 text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {profile.name}
        </h1>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 rounded-2xl border border-hairline bg-surface p-6 sm:grid-cols-4">
        <StatTile
          label="本月營收"
          value={formatCompactTWD(monthlyRevenue.at(-1)!)}
          hint="較上月 +4.3%"
        />
        <StatTile
          label="RRS 分數"
          value={rrs.current}
          hint="營收穩定"
        />
        <StatTile
          label="分潤回收進度"
          value={formatPct(pctRepaid, 0)}
          hint={`${formatCompactTWD(totalRepaid)} / ${formatCompactTWD(cap)}`}
        />
        <StatTile
          label="資料來源"
          value={`${connectedCount}/${dataSources.length}`}
          hint="已連接"
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-hairline bg-surface p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-medium text-ink">數位營收趨勢</h2>
            <Link
              to="/connections"
              className="text-sm font-medium text-accent-700 hover:text-accent-800"
            >
              管理資料來源 →
            </Link>
          </div>
          <div className="mt-5">
            <RevenueChart data={monthlyRevenue} />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="rounded-2xl border border-hairline bg-surface p-5">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-ink">目前融資</span>
              <span className="text-ink-muted">{financing.startedAt} 開始</span>
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-ink-muted">已回收 / 總回收上限</span>
                <span className="tabular text-ink-secondary">{formatPct(pctRepaid, 0)}</span>
              </div>
              <ProgressBar value={totalRepaid} max={cap} />
            </div>
            <Link
              to="/repayment"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-700 hover:text-accent-800"
            >
              查看還款與撥款明細 <ArrowRight size={14} />
            </Link>
          </div>

          <Link
            to="/apply"
            className="rounded-2xl border border-accent-200 bg-accent-50 p-5 transition-colors hover:border-accent-300"
          >
            <p className="font-medium text-accent-800">想申請新一輪融資？</p>
            <p className="mt-1 text-sm text-accent-700/80">
              依目前 RRS 分數，預估可申請 NT$80–120 萬元
            </p>
          </Link>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-medium text-ink">AI 財務建議</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {aiSuggestions.map((s) => {
            const Icon = suggestionIcon[s.type];
            const isPromo = s.type === "promo";
            const adopted = adoptedPromos.has(s.title);
            return (
              <div key={s.title} className="flex flex-col gap-3 rounded-2xl border border-hairline bg-surface p-5">
                <Pill tone={suggestionTone[s.type]}>
                  <Icon size={13} weight="bold" />
                  {suggestionLabel[s.type]}
                </Pill>
                <p className="font-medium text-ink">{s.title}</p>
                <p className="text-sm leading-relaxed text-ink-secondary">{s.body}</p>
                {isPromo && (
                  <Button
                    variant={adopted ? "ghost" : "primary"}
                    size="md"
                    className="mt-1 w-fit"
                    disabled={adopted}
                    onClick={() => setAdoptedPromos((prev) => new Set(prev).add(s.title))}
                  >
                    {adopted ? "已採用，等待促購 Agent 發送" : "採用此建議"}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
