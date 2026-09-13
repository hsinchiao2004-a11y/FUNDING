import { useState } from "react";
import clsx from "clsx";
import { Storefront, ArrowsLeftRight, Info, CheckCircle, X } from "@phosphor-icons/react";
import { usePortfolio } from "../lib/PortfolioContext";
import { useTransferMarket, type IntentStatus, type SettlementCurrency } from "../lib/TransferMarketContext";
import { getMerchant } from "../data/merchants";
import { Button } from "../components/Button";
import { formatTWD, formatByCurrency, formatPct } from "../lib/format";

const CURRENCIES: SettlementCurrency[] = ["TWD", "USDT", "USDC", "WPT"];
const currencyLabel: Record<SettlementCurrency, string> = {
  TWD: "新台幣 (NT$)",
  USDT: "USDT",
  USDC: "USDC",
  WPT: "旺鋪幣 (WPT)",
};
import { Link } from "react-router-dom";

const statusConfig: Record<IntentStatus, { label: string; className: string }> = {
  listed: { label: "意向掛牌中", className: "bg-accent-50 text-accent-700" },
  completed: { label: "已完成過戶", className: "bg-status-good/10 text-[#0ca30c]" },
};

function StatusBadge({ status }: { status: IntentStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", cfg.className)}>
      {cfg.label}
    </span>
  );
}

type Tab = "board" | "mine";

export function Transfers() {
  const { holdings, removeHoldingAt, addHolding } = usePortfolio();
  const { intents, addIntent, removeIntent, updateStatus } = useTransferMarket();
  const [tab, setTab] = useState<Tab>("board");
  const [listingIndex, setListingIndex] = useState<number | null>(null);
  const [askPriceDraft, setAskPriceDraft] = useState(0);
  const [currencyDraft, setCurrencyDraft] = useState<SettlementCurrency>("TWD");

  const startListing = (index: number, amount: number) => {
    setListingIndex(index);
    setAskPriceDraft(amount);
    setCurrencyDraft("TWD");
  };

  const confirmListing = (index: number) => {
    const holding = holdings[index];
    if (!holding) return;
    addIntent({
      merchantId: holding.merchantId,
      amount: holding.amount,
      askPrice: askPriceDraft,
      currency: currencyDraft,
      seller: "me",
    });
    removeHoldingAt(index);
    setListingIndex(null);
  };

  const cancelListing = (intentId: string, merchantId: string, amount: number) => {
    removeIntent(intentId);
    addHolding(merchantId, amount);
  };

  const expressInterest = (intentId: string, merchantId: string, amount: number) => {
    updateStatus(intentId, "completed");
    addHolding(merchantId, amount);
  };

  const boardIntents = intents.slice().sort((a, b) => (a.listedAt < b.listedAt ? 1 : -1));
  const myIntents = intents.filter((i) => i.seller === "me");

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">轉讓看板</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-secondary">
        為提升持有部位的流動性，投資人可張貼轉讓意向，其他投資人點選承接後即時完成過戶。
      </p>

      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-hairline bg-surface p-4">
        <Info size={18} weight="duotone" className="mt-0.5 shrink-0 text-accent-600" />
        <p className="text-xs leading-relaxed text-ink-muted">
          點選「我要承接」後即時完成過戶、納入你的投資組合，不需等待審核。刊登轉讓意向時
          可選擇以新台幣、穩定幣（USDT、USDC），或平台原生代幣「旺鋪幣（WPT）」計價結算——
          以旺鋪幣結算可享較低之媒合手續費。實際匯率以撮合當下之市場報價為準（本頁為示範用途）。
        </p>
      </div>

      <div className="mt-8 flex gap-2 border-b border-hairline">
        <button
          onClick={() => setTab("board")}
          className={clsx(
            "border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
            tab === "board" ? "border-accent-600 text-ink" : "border-transparent text-ink-muted hover:text-ink",
          )}
        >
          轉讓看板
        </button>
        <button
          onClick={() => setTab("mine")}
          className={clsx(
            "border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
            tab === "mine" ? "border-accent-600 text-ink" : "border-transparent text-ink-muted hover:text-ink",
          )}
        >
          我要轉讓
        </button>
      </div>

      {tab === "board" && (
        <div className="mt-6 flex flex-col gap-3">
          {boardIntents.length === 0 && (
            <p className="py-12 text-center text-sm text-ink-muted">目前看板上沒有任何轉讓意向。</p>
          )}
          {boardIntents.map((intent) => {
            const merchant = getMerchant(intent.merchantId);
            if (!merchant) return null;
            const delta = ((intent.askPrice - intent.amount) / intent.amount) * 100;
            const isMine = intent.seller === "me";
            return (
              <div
                key={intent.id}
                className="flex flex-col gap-3 rounded-2xl border border-hairline bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                    <Storefront size={18} weight="duotone" />
                  </div>
                  <div>
                    <p className="font-medium text-ink">{merchant.name}</p>
                    <p className="text-xs text-ink-muted">
                      {isMine ? "你的刊登" : intent.seller} · 面額 {formatTWD(intent.amount)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-right">
                    <p className="tabular font-mono text-sm font-medium text-ink">
                      {formatByCurrency(intent.askPrice, intent.currency)}
                    </p>
                    {intent.currency === "TWD" ? (
                      <p className={clsx("text-xs", delta >= 0 ? "text-ink-muted" : "text-status-critical")}>
                        {delta >= 0 ? "溢價" : "折價"} {formatPct(Math.abs(delta), 1)}
                      </p>
                    ) : (
                      <p className="text-xs text-ink-muted">以 {intent.currency} 計價結算</p>
                    )}
                  </div>
                  <StatusBadge status={intent.status} />
                  {!isMine && intent.status === "listed" && (
                    <Button size="md" onClick={() => expressInterest(intent.id, intent.merchantId, intent.amount)}>
                      我要承接
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "mine" && (
        <div className="mt-6 flex flex-col gap-10">
          <section>
            <h2 className="text-sm font-medium text-ink-secondary">我目前持有（可刊登轉讓）</h2>
            {holdings.length === 0 ? (
              <div className="mt-3 rounded-2xl border border-dashed border-hairline p-8 text-center">
                <p className="text-sm text-ink-muted">你還沒有任何投資，無法刊登轉讓。</p>
                <Link to="/marketplace" className="mt-2 inline-block text-sm font-medium text-accent-700 hover:text-accent-800">
                  瀏覽商家 →
                </Link>
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-3">
                {holdings.map((holding, index) => {
                  const merchant = getMerchant(holding.merchantId);
                  if (!merchant) return null;
                  const isListing = listingIndex === index;
                  return (
                    <div key={index} className="rounded-2xl border border-hairline bg-surface p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                            <ArrowsLeftRight size={16} weight="duotone" />
                          </div>
                          <div>
                            <p className="font-medium text-ink">{merchant.name}</p>
                            <p className="tabular text-xs text-ink-muted">面額 {formatTWD(holding.amount)}</p>
                          </div>
                        </div>
                        {!isListing && (
                          <Button variant="ghost" size="md" onClick={() => startListing(index, holding.amount)}>
                            刊登轉讓意向
                          </Button>
                        )}
                      </div>
                      {isListing && (
                        <div className="mt-4 flex flex-col gap-3 border-t border-hairline pt-4 sm:flex-row sm:items-end sm:gap-4">
                          <div className="flex flex-1 flex-col gap-1.5">
                            <label className="text-xs font-medium text-ink-secondary">希望取得價金</label>
                            <div className="flex items-center gap-2 rounded-xl border border-hairline bg-plane px-3 py-2 focus-within:border-accent-400">
                              <span className="text-sm text-ink-muted">
                                {currencyDraft === "TWD" ? "NT$" : currencyDraft}
                              </span>
                              <input
                                type="number"
                                value={askPriceDraft}
                                onChange={(e) => setAskPriceDraft(Number(e.target.value) || 0)}
                                className="tabular w-full bg-transparent font-mono text-sm text-ink outline-none"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-ink-secondary">結算幣種</label>
                            <select
                              value={currencyDraft}
                              onChange={(e) => setCurrencyDraft(e.target.value as SettlementCurrency)}
                              className="rounded-xl border border-hairline bg-plane px-3 py-2 text-sm text-ink outline-none focus:border-accent-400"
                            >
                              {CURRENCIES.map((c) => (
                                <option key={c} value={c}>
                                  {currencyLabel[c]}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <Button size="md" onClick={() => confirmListing(index)}>
                              確認刊登
                            </Button>
                            <Button variant="ghost" size="md" onClick={() => setListingIndex(null)}>
                              <X size={15} />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-sm font-medium text-ink-secondary">我的刊登紀錄</h2>
            {myIntents.length === 0 ? (
              <p className="mt-3 text-sm text-ink-muted">目前沒有刊登中的轉讓意向。</p>
            ) : (
              <div className="mt-3 flex flex-col divide-y divide-hairline rounded-2xl border border-hairline bg-surface">
                {myIntents.map((intent) => {
                  const merchant = getMerchant(intent.merchantId);
                  if (!merchant) return null;
                  return (
                    <div key={intent.id} className="flex items-center justify-between gap-4 p-4">
                      <div>
                        <p className="text-sm font-medium text-ink">{merchant.name}</p>
                        <p className="tabular text-xs text-ink-muted">
                          面額 {formatTWD(intent.amount)} · 希望價金 {formatByCurrency(intent.askPrice, intent.currency)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={intent.status} />
                        {intent.status === "listed" && (
                          <Button
                            variant="ghost"
                            size="md"
                            onClick={() => cancelListing(intent.id, intent.merchantId, intent.amount)}
                          >
                            取消刊登
                          </Button>
                        )}
                        {intent.status === "completed" && (
                          <CheckCircle size={16} weight="fill" className="text-accent-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
