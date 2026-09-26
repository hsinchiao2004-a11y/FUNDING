import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Robot,
  MagnifyingGlass,
  Storefront,
  ChartPieSlice,
  Handshake,
  ArrowsLeftRight,
  ArrowClockwise,
  Megaphone,
  FileText,
  Pulse,
  Coins,
  CalendarCheck,
} from "@phosphor-icons/react";
import { usePortfolio } from "../lib/PortfolioContext";
import { useNotifications } from "../lib/NotificationContext";
import { getMerchant, merchants, type RiskTier } from "../data/merchants";
import { getExitMatchSuggestion, suggestedExitPrice } from "../lib/agentMatch";
import { RiskBadge } from "../components/Badge";
import { PortfolioPieChart, type PieSlice } from "../components/PortfolioPieChart";
import { formatTWD } from "../lib/format";

const suggestionByTier: Record<RiskTier, string> = {
  low: "營收穩定、風險偏低，AI 建議：維持現有部位，持續累積分潤。",
  medium: "營收處於成長期但波動較大，AI 建議：留意本月分潤入帳狀況，暫不加碼。",
  elevated: "近期波動較高，AI 建議：可考慮於轉讓看板部分變現，分散風險。",
};

// 分潤除了平台預設每月撥付，Agent 也會依營收表現主動提醒是否要滾入再投資——
// 表現極佳時建議加碼複利，波動加大時則建議先觀察、暫緩再投資。
const reinvestReminderByTier: Record<RiskTier, string> = {
  low: "營收表現極佳，Agent 建議將本期分潤滾入再投資，複利累積分潤權。",
  medium: "營收表現持平，Agent 暫不主動提醒再投資，維持每月分潤撥付即可。",
  elevated: "波動偏大時，Agent 建議暫緩自動再投資，先觀察 1–2 期營收再決定。",
};

// 示範用：投資分身 Agent 這幾天實際跑過的檢查紀錄，強調「持續」而非「核准
// 當下算一次分數就結束」。
const monitoringLog = [
  { time: "3 小時前", note: "完成本輪營收數據交叉比對，未發現異常" },
  { time: "1 天前", note: "偵測到 1 家商家電子發票金額與 POS 數據落差超過門檻，已標記人工複查" },
  { time: "3 天前", note: "依最新月營收重新計算風險分數，2 家商家評級維持不變" },
];

const scenario = [
  {
    time: "第 0 天",
    title: "商家申請融資",
    actor: "花見咖啡 Brew & Bloom．主理人陳雅婷",
    icon: FileText,
    body: "陳雅婷在商家端完成核實資料（統一編號、歷年稅籍、銀行帳戶、信用評分），核貸額度 NT$3,000,000，資金用途分配為租金保證金 40%、店面裝修 40%、設備採購 20%，平台核准並開放募資。",
  },
  {
    time: "第 2 天",
    title: "Agent 主動媒合，非投資人自己海選",
    actor: "投資人 Lisa",
    icon: MagnifyingGlass,
    body: "Lisa 設定「穩定型」風險偏好後，Agent 主動把 RRS 82 分、低風險、預估年化報酬 9–13% 的花見咖啡推薦給她，而不是要她自己從一長串商家清單裡篩選。Lisa 投資 NT$20,000，同步解鎖「季度店主見面會」回饋。",
  },
  {
    time: "第 4 個月",
    title: "營收波動，投資分身 Agent 主動介入",
    actor: "投資分身 Agent",
    icon: Pulse,
    body: "花見咖啡因店休整修，當月營收較預期下滑。Agent 偵測到異常後，主動通知 Lisa「本期分潤已同步下修，建議先觀察一季、暫不加碼」，同時標記商家端需補充說明——不需要 Lisa 自己盯營收數字。",
  },
  {
    time: "第 4 個月",
    title: "消費循環 Agent 主動觸發回訪",
    actor: "消費循環 Agent → Lisa",
    icon: Megaphone,
    body: "Agent 同時偵測到 Lisa 已 45 天沒有到店消費，主動發送「投資人專屬 9 折」到店優惠通知。Lisa 到店消費、順便看看自己投資的店——投資關係變成實際消費，而不是等她自己想起來。",
  },
  {
    time: "第 7 個月",
    title: "營收回升，分潤入帳",
    actor: "Lisa",
    icon: Coins,
    body: "花見咖啡營收回升至月營收 NT$940,000 以上，Lisa 當期分潤入帳，她選擇把部分分潤以 1.2 倍加碼折抵為到店消費金，而不是直接提領。",
  },
  {
    time: "第 10 個月",
    title: "提前退場，Agent 主動撮合承接方",
    actor: "退場媒合 Agent → Lisa",
    icon: Handshake,
    body: "Lisa 因資金需求想提前變現剩餘部位。刊登轉讓意向的同時，退場媒合 Agent 已依市場行情建議意願價格，48 小時內完成與另一位投資人的過戶交割，Lisa 取得價金，不需在看板上被動等待。",
  },
];

export function Agents() {
  const { holdings } = usePortfolio();
  const { notifications } = useNotifications();
  const hasHoldings = holdings.length > 0;

  const monitoredMerchants = hasHoldings
    ? Array.from(new Set(holdings.map((h) => h.merchantId))).map((id) => getMerchant(id)!).filter(Boolean)
    : merchants.slice(0, 3);

  const holdingTotals = useMemo(() => {
    const totals = new Map<string, number>();
    for (const h of holdings) {
      totals.set(h.merchantId, (totals.get(h.merchantId) ?? 0) + h.amount);
    }
    return totals;
  }, [holdings]);

  const pieSlices: PieSlice[] = useMemo(() => {
    if (hasHoldings) {
      return Array.from(holdingTotals.entries())
        .map(([merchantId, value]) => ({ label: getMerchant(merchantId)?.name ?? merchantId, value }))
        .sort((a, b) => b.value - a.value);
    }
    // 示範資料：3 家demo商家平均分配
    return monitoredMerchants.map((m) => ({ label: m.name, value: 1 }));
  }, [hasHoldings, holdingTotals, monitoredMerchants]);

  const loopExample = notifications[0];
  const loopMerchant = loopExample ? getMerchant(loopExample.merchantId) : undefined;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent-700">
          <Robot size={24} weight="duotone" />
        </div>
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">AI Agent</h1>
          <p className="text-sm text-ink-secondary">三種 Agent 持續在背景協同運作，不是核准當下算一次分數就結束</p>
        </div>
      </div>

      {!hasHoldings && (
        <div className="mt-4 rounded-xl border border-hairline bg-plane px-4 py-3 text-xs text-ink-muted">
          你還沒有任何投資，以下以 3 家商家做情境示範。
          <Link to="/marketplace" className="ml-1 font-medium text-accent-700 hover:text-accent-800">
            瀏覽商家 →
          </Link>
        </div>
      )}

      {/* 1. 退場媒合 Agent —— 優先深化：取代傳統交易所式次級市場 */}
      <section className="mt-10">
        <div className="flex items-center gap-2">
          <Handshake size={18} weight="duotone" className="text-accent-600" />
          <h2 className="text-lg font-medium text-ink">退場媒合 Agent</h2>
        </div>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-secondary">
          傳統次級市場要投資人自己刊登、被動等人瀏覽承接。退場媒合 Agent 反過來持續掃描
          全平台投資人的風險偏好與資金需求，主動為你的每一筆持股尋找潛在承接方，並直接
          建議一個容易成交的價格。
        </p>

        <div className="mt-4 flex flex-col divide-y divide-hairline rounded-2xl border border-hairline bg-surface">
          {monitoredMerchants.map((merchant) => {
            const suggestion = getExitMatchSuggestion(merchant.riskTier);
            const amount = holdingTotals.get(merchant.id);
            return (
              <div key={merchant.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                    <Storefront size={16} weight="duotone" />
                  </div>
                  <div>
                    <p className="font-medium text-ink">{merchant.name}</p>
                    <p className="text-xs text-ink-muted">
                      Agent 已找到 {suggestion.matches} 位潛在承接方
                      {amount ? `．建議意願價格 ${formatTWD(suggestedExitPrice(amount, merchant.riskTier))}` : ""}
                    </p>
                  </div>
                </div>
                {hasHoldings && (
                  <Link
                    to="/transfers"
                    className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-accent-700 hover:text-accent-800"
                  >
                    <ArrowsLeftRight size={14} />
                    前往轉讓看板
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. 投資分身 Agent —— 次要：持續動態管理，而非一次性評分 */}
      <section className="mt-10">
        <div className="flex items-center gap-2">
          <MagnifyingGlass size={18} weight="duotone" className="text-accent-600" />
          <h2 className="text-lg font-medium text-ink">投資分身 Agent</h2>
        </div>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-secondary">
          從一開始的商家推薦到之後的持續監控，都是同一個 Agent 在管理，而不是核准當下算一次
          分數就結束——先透過風險、獲利、商家性質偏好調查幫你篩出第一批推薦商家，之後每天
          都在替你的投資組合值班、主動給出建議。
        </p>

        <Link
          to="/agent-match"
          className="group mt-4 flex items-center justify-between gap-4 rounded-xl border border-hairline bg-plane px-4 py-3 transition-colors hover:border-accent-300"
        >
          <span className="text-sm font-medium text-ink">還沒設定偏好？先做一次 Agent 客製化推薦</span>
          <span className="shrink-0 text-sm font-medium text-accent-700 group-hover:text-accent-800">前往 →</span>
        </Link>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-hairline bg-plane px-4 py-2.5 text-xs text-ink-muted">
          <CalendarCheck size={14} className="shrink-0 text-accent-600" />
          已連續監控 128 天．累計產生 37 則建議
        </div>

        <div className="mt-4 rounded-2xl border border-hairline bg-surface p-6">
          <div className="flex items-center gap-2">
            <ChartPieSlice size={16} weight="duotone" className="text-accent-600" />
            <p className="text-sm font-medium text-ink">
              {hasHoldings ? "投資組合分布（依投資金額）" : "投資組合分布（示範）"}
            </p>
          </div>
          <div className="mt-4">
            <PortfolioPieChart slices={pieSlices} />
          </div>
        </div>

        <div className="mt-4 flex flex-col divide-y divide-hairline rounded-2xl border border-hairline bg-surface">
          {monitoredMerchants.map((merchant, i) => (
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
              <span className="shrink-0 text-xs text-ink-muted sm:pl-3">
                更新於 {monitoringLog[i % monitoringLog.length].time}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-hairline bg-surface p-6">
          <div className="flex items-center gap-2">
            <ArrowClockwise size={16} weight="duotone" className="text-accent-600" />
            <p className="text-sm font-medium text-ink">分潤再投資提醒</p>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
            分潤預設每月撥付，但 Agent 會依營收表現主動判斷是否該提醒你滾入再投資——營收表現極
            佳時建議加碼複利，波動加大時則建議先觀察、暫緩再投資，而不是等你自己想到才去操作。
          </p>
          <div className="mt-4 flex flex-col divide-y divide-hairline">
            {monitoredMerchants.map((merchant) => (
              <div key={merchant.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
                    <Storefront size={14} weight="duotone" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{merchant.name}</p>
                    <p className="mt-0.5 max-w-md text-xs text-ink-secondary">
                      {reinvestReminderByTier[merchant.riskTier]}
                    </p>
                  </div>
                </div>
                {hasHoldings && holdingTotals.get(merchant.id) && (
                  <Link
                    to="/portfolio"
                    className="shrink-0 whitespace-nowrap text-xs font-medium text-accent-700 hover:text-accent-800"
                  >
                    前往滾入再投資 →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 消費循環 Agent —— 最具差異化：投資人變消費者，主動觸發 */}
      <section className="mt-10">
        <div className="flex items-center gap-2">
          <Megaphone size={18} weight="duotone" className="text-accent-600" />
          <h2 className="text-lg font-medium text-ink">消費循環 Agent</h2>
        </div>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-secondary">
          持續比對你投資商家的「營收變化」與你「最近一次到店消費」的時間，一旦偵測到營收波動、
          或你已一段時間沒有到店，就主動生成個人化到店優惠並推播通知——把投資關係主動導回實際
          消費，而不是被動期待「投資人變消費者」的循環自然發生。
        </p>

        {loopExample && loopMerchant && (
          <div className="mt-4 rounded-2xl border border-hairline bg-surface p-5">
            <p className="text-xs font-medium text-ink-muted">最近一次觸發</p>
            <div className="mt-2 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                <Storefront size={16} weight="duotone" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">{loopMerchant.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{loopExample.message}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. 情境示範 —— 具體人物與時間軸 */}
      <section className="mt-10">
        <h2 className="text-lg font-medium text-ink">情境示範</h2>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-secondary">
          從商家申請融資到投資人提前退場，三種 Agent 如何在同一段旅程裡各自主動介入。
        </p>

        <div className="mt-6 flex flex-col">
          {scenario.map((step, i) => (
            <div key={step.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-700">
                  <step.icon size={16} weight="duotone" />
                </div>
                {i < scenario.length - 1 && <div className="w-px flex-1 bg-hairline" />}
              </div>
              <div className="flex-1 pb-8">
                <p className="text-xs font-medium text-ink-muted">{step.time}</p>
                <p className="mt-0.5 font-medium text-ink">{step.title}</p>
                <p className="mt-0.5 text-xs text-accent-700">{step.actor}</p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-secondary">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
