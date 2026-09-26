import { useState } from "react";
import clsx from "clsx";
import { Coins, Info, CheckCircle, X, ArrowsDownUp } from "@phosphor-icons/react";
import { useTokenMarket, type CashCurrency, type TokenListingStatus } from "../lib/TokenMarketContext";
import { Button } from "../components/Button";
import { formatByCurrency, formatTWD, formatWpt, twdToWpt, WPT_RATE_TWD } from "../lib/format";

const CURRENCIES: CashCurrency[] = ["TWD", "USDT", "USDC"];
const currencyLabel: Record<CashCurrency, string> = {
  TWD: "新台幣 (NT$)",
  USDT: "USDT",
  USDC: "USDC",
};

const statusConfig: Record<TokenListingStatus, { label: string; className: string }> = {
  listed: { label: "掛牌中", className: "bg-accent-50 text-accent-700" },
  completed: { label: "已完成交割", className: "bg-status-good/10 text-[#0ca30c]" },
};

function StatusBadge({ status }: { status: TokenListingStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", cfg.className)}>
      {cfg.label}
    </span>
  );
}

type Tab = "board" | "mine";

export function TokenExchange() {
  const { wptBalance, listings, listForCash, cancelListing, takeListing, buyWithTwd } = useTokenMarket();
  const [tab, setTab] = useState<Tab>("board");
  const [amountDraft, setAmountDraft] = useState(0);
  const [priceDraft, setPriceDraft] = useState(0);
  const [currencyDraft, setCurrencyDraft] = useState<CashCurrency>("TWD");
  const [buyTwdDraft, setBuyTwdDraft] = useState(10_000);

  const buyWptPreview = twdToWpt(buyTwdDraft);
  const submitBuy = () => {
    if (buyTwdDraft <= 0) return;
    buyWithTwd(buyTwdDraft);
    setBuyTwdDraft(0);
  };

  const boardListings = listings
    .filter((l) => l.seller !== "me")
    .slice()
    .sort((a, b) => (a.listedAt < b.listedAt ? 1 : -1));
  const myListings = listings.filter((l) => l.seller === "me");

  const canSubmit = amountDraft > 0 && amountDraft <= wptBalance && priceDraft > 0;

  const submitListing = () => {
    if (!canSubmit) return;
    listForCash(amountDraft, priceDraft, currencyDraft);
    setAmountDraft(0);
    setPriceDraft(0);
    setCurrencyDraft("TWD");
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">平台幣兌現轉讓</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-secondary">
        尚未投入特定商家、或商家合約已結清而返還的挺店幣，可在這裡登記兌換為新台幣或穩定幣。
        平台收取成交金額 <span className="font-medium text-ink">0.5%</span> 之手續費（買賣雙邊各收）。
      </p>

      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-hairline bg-surface p-4">
        <Info size={18} weight="duotone" className="mt-0.5 shrink-0 text-accent-600" />
        <p className="text-xs leading-relaxed text-ink-muted">
          投資人持有尚未投入特定商家、或商家合約已結清而返還之平台幣，若欲兌現為新台幣或
          穩定幣，得於平台登記欲兌換之平台幣數量與意願價格，由其他有意願以新台幣或穩定幣
          （如 USDT、USDC）承接該筆平台幣之投資人瀏覽掛牌後，雙方確認交易條件，即時完成
          價款與平台幣之交割，平台同步更新雙方之平台幣持有紀錄。此一機制之標的僅為平台幣
          本身，尚未涉及任何特定商家之分潤請求權，性質上近似於平台幣與法幣或穩定幣之兌換窗口。
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-hairline bg-plane p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
          <Coins size={18} weight="duotone" />
        </div>
        <div>
          <p className="text-xs text-ink-muted">我的平台幣餘額</p>
          <p className="tabular font-mono text-lg font-medium text-ink">{wptBalance.toLocaleString("zh-Hant-TW")} WPT</p>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-hairline bg-surface p-6">
        <div className="flex items-center gap-2">
          <ArrowsDownUp size={16} weight="duotone" className="text-accent-600" />
          <h2 className="text-sm font-medium text-ink">用新台幣兌換平台幣</h2>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-ink-muted">
          投資特定商家前，須先將新台幣兌換為平台幣（WPT）。平台固定掛牌匯率為 1 WPT = {formatTWD(WPT_RATE_TWD)}，
          兌換即時到帳，之後即可於商家頁面用平台幣投資分潤權。
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-secondary">兌換金額</label>
            <div className="flex items-center gap-2 rounded-xl border border-hairline bg-plane px-3 py-2 focus-within:border-accent-400">
              <span className="text-sm text-ink-muted">NT$</span>
              <input
                type="number"
                min={0}
                step={1000}
                value={buyTwdDraft}
                onChange={(e) => setBuyTwdDraft(Number(e.target.value) || 0)}
                className="tabular w-full bg-transparent font-mono text-sm text-ink outline-none"
              />
            </div>
          </div>
          <p className="tabular shrink-0 text-sm text-ink-secondary sm:pb-2.5">
            ≈ {formatWpt(buyWptPreview)}
          </p>
          <Button size="md" disabled={buyTwdDraft <= 0} onClick={submitBuy}>
            確認兌換
          </Button>
        </div>
      </section>

      <div className="mt-8 flex gap-2 border-b border-hairline">
        <button
          onClick={() => setTab("board")}
          className={clsx(
            "border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
            tab === "board" ? "border-accent-600 text-ink" : "border-transparent text-ink-muted hover:text-ink",
          )}
        >
          兌換看板
        </button>
        <button
          onClick={() => setTab("mine")}
          className={clsx(
            "border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
            tab === "mine" ? "border-accent-600 text-ink" : "border-transparent text-ink-muted hover:text-ink",
          )}
        >
          我要兌現
        </button>
      </div>

      {tab === "board" && (
        <div className="mt-6 flex flex-col gap-3">
          {boardListings.length === 0 && (
            <p className="py-12 text-center text-sm text-ink-muted">目前看板上沒有任何平台幣兌現掛牌。</p>
          )}
          {boardListings.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-col gap-3 rounded-2xl border border-hairline bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                  <Coins size={18} weight="duotone" />
                </div>
                <div>
                  <p className="tabular font-medium text-ink">{listing.wptAmount.toLocaleString("zh-Hant-TW")} WPT</p>
                  <p className="text-xs text-ink-muted">{listing.seller}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-right">
                  <p className="tabular font-mono text-sm font-medium text-ink">
                    {formatByCurrency(listing.askPrice, listing.currency)}
                  </p>
                  <p className="text-xs text-ink-muted">意願價格</p>
                </div>
                <StatusBadge status={listing.status} />
                {listing.status === "listed" && (
                  <Button size="md" onClick={() => takeListing(listing.id)}>
                    我要承接
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "mine" && (
        <div className="mt-6 flex flex-col gap-10">
          <section>
            <h2 className="text-sm font-medium text-ink-secondary">登記兌換</h2>
            <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-hairline bg-surface p-5 sm:flex-row sm:items-end sm:gap-4">
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-xs font-medium text-ink-secondary">欲兌換之平台幣數量</label>
                <div className="flex items-center gap-2 rounded-xl border border-hairline bg-plane px-3 py-2 focus-within:border-accent-400">
                  <input
                    type="number"
                    min={0}
                    max={wptBalance}
                    value={amountDraft}
                    onChange={(e) => setAmountDraft(Number(e.target.value) || 0)}
                    className="tabular w-full bg-transparent font-mono text-sm text-ink outline-none"
                  />
                  <span className="text-sm text-ink-muted">WPT</span>
                </div>
                {amountDraft > wptBalance && (
                  <p className="text-xs text-status-critical">超過目前持有餘額（{wptBalance.toLocaleString("zh-Hant-TW")} WPT）</p>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-xs font-medium text-ink-secondary">意願價格</label>
                <div className="flex items-center gap-2 rounded-xl border border-hairline bg-plane px-3 py-2 focus-within:border-accent-400">
                  <span className="text-sm text-ink-muted">{currencyDraft === "TWD" ? "NT$" : currencyDraft}</span>
                  <input
                    type="number"
                    min={0}
                    value={priceDraft}
                    onChange={(e) => setPriceDraft(Number(e.target.value) || 0)}
                    className="tabular w-full bg-transparent font-mono text-sm text-ink outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-ink-secondary">兌換幣別</label>
                <select
                  value={currencyDraft}
                  onChange={(e) => setCurrencyDraft(e.target.value as CashCurrency)}
                  className="rounded-xl border border-hairline bg-plane px-3 py-2 text-sm text-ink outline-none focus:border-accent-400"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {currencyLabel[c]}
                    </option>
                  ))}
                </select>
              </div>
              <Button size="md" disabled={!canSubmit} onClick={submitListing}>
                確認掛牌
              </Button>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-medium text-ink-secondary">我的掛牌紀錄</h2>
            {myListings.length === 0 ? (
              <p className="mt-3 text-sm text-ink-muted">目前沒有掛牌中的平台幣兌現意向。</p>
            ) : (
              <div className="mt-3 flex flex-col divide-y divide-hairline rounded-2xl border border-hairline bg-surface">
                {myListings.map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between gap-4 p-4">
                    <div>
                      <p className="tabular text-sm font-medium text-ink">
                        {listing.wptAmount.toLocaleString("zh-Hant-TW")} WPT
                      </p>
                      <p className="tabular text-xs text-ink-muted">
                        意願價格 {formatByCurrency(listing.askPrice, listing.currency)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={listing.status} />
                      {listing.status === "listed" && (
                        <Button variant="ghost" size="md" onClick={() => cancelListing(listing.id)}>
                          <X size={15} />
                          取消掛牌
                        </Button>
                      )}
                      {listing.status === "completed" && (
                        <CheckCircle size={16} weight="fill" className="text-accent-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
