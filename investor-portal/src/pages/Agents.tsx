import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Robot,
  MagnifyingGlass,
  Megaphone,
  Storefront,
  PaperPlaneTilt,
  Sparkle,
} from "@phosphor-icons/react";
import { usePortfolio } from "../lib/PortfolioContext";
import { getMerchant, merchants, type RiskTier } from "../data/merchants";
import { RiskBadge } from "../components/Badge";
import { Button } from "../components/Button";

const suggestionByTier: Record<RiskTier, string> = {
  low: "營收穩定、風險偏低，AI 建議：維持現有部位，持續累積分潤。",
  medium: "營收處於成長期但波動較大，AI 建議：留意本月分潤入帳狀況，暫不加碼。",
  elevated: "近期波動較高，AI 建議：可考慮於意向轉讓看板部分變現，分散風險。",
};

const demoMerchant = merchants.find((m) => m.id === "riverside-pizza")!;

export function Agents() {
  const { holdings } = usePortfolio();
  const [messageSent, setMessageSent] = useState(false);

  const monitoredMerchants = holdings.length > 0
    ? Array.from(new Set(holdings.map((h) => h.merchantId))).map((id) => getMerchant(id)!).filter(Boolean)
    : merchants.slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent-700">
          <Robot size={24} weight="duotone" />
        </div>
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">AI Agent</h1>
          <p className="text-sm text-ink-secondary">持續在背景運作的兩個代理式 AI 助理</p>
        </div>
      </div>

      {holdings.length === 0 && (
        <div className="mt-6 rounded-xl border border-hairline bg-plane px-4 py-3 text-xs text-ink-muted">
          你還沒有任何投資，以下以 3 家商家做情境示範。
          <Link to="/marketplace" className="ml-1 font-medium text-accent-700 hover:text-accent-800">
            瀏覽商家 →
          </Link>
        </div>
      )}

      {/* Agent 1: Risk monitoring */}
      <section className="mt-10">
        <div className="flex items-center gap-2">
          <MagnifyingGlass size={18} weight="duotone" className="text-accent-600" />
          <h2 className="text-lg font-medium text-ink">風險監測管理 Agent</h2>
        </div>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-secondary">
          持續掃描你持有的每一筆分潤權與商家風險狀態，主動給出建議，而不是等你自己發現異常。
        </p>

        <div className="mt-5 flex flex-col divide-y divide-hairline rounded-2xl border border-hairline bg-surface">
          {monitoredMerchants.map((merchant) => (
            <div key={merchant.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                  <Storefront size={16} weight="duotone" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-ink">{merchant.name}</p>
                    <RiskBadge tier={merchant.riskTier} />
                  </div>
                  <p className="mt-1 max-w-md text-sm text-ink-secondary">
                    {suggestionByTier[merchant.riskTier]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Agent 2: investor -> consumer activation */}
      <section className="mt-12">
        <div className="flex items-center gap-2">
          <Megaphone size={18} weight="duotone" className="text-accent-600" />
          <h2 className="text-lg font-medium text-ink">「投資人變消費者」促購 Agent</h2>
        </div>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-secondary">
          偵測到已投資商家營收下滑時，不是被動通知「分潤可能變少」，而是主動生成一則邀請消費的訊息，
          把投資人的焦慮轉化成幫商家拉抬營收的具體行動。
        </p>

        <div className="mt-5 rounded-2xl border border-hairline bg-surface p-6">
          <div className="flex items-start gap-3 rounded-xl border border-status-warning/30 bg-status-warning/10 p-4">
            <Sparkle size={18} weight="fill" className="mt-0.5 shrink-0 text-[#946200]" />
            <p className="text-sm text-[#946200]">
              情境示範：AI 偵測到 {demoMerchant.name} 本月營收較上月略降，已為你生成一則邀請消費的訊息。
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-hairline bg-plane p-4">
            <p className="text-sm leading-relaxed text-ink">
              「好久不見！{demoMerchant.name}最近推出新菜單，身為投資人的你享有專屬優惠——
              這週到店消費享 9 折，順便看看你投資的店最近的樣子 😊」
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button size="md" onClick={() => setMessageSent(true)} disabled={messageSent}>
              <PaperPlaneTilt size={15} />
              {messageSent ? "已分享給朋友" : "分享給朋友"}
            </Button>
            {messageSent && <span className="text-xs text-accent-700">已模擬送出（示範，不會真的發送）</span>}
          </div>
        </div>
      </section>
    </div>
  );
}
