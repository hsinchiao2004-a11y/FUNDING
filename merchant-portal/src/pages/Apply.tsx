import { useMemo, useRef, useState } from "react";
import { Sparkle, Info, Plus, Trash } from "@phosphor-icons/react";
import { useApplications } from "../lib/ApplicationContext";
import { Button } from "../components/Button";
import { formatTWD, clamp } from "../lib/format";

const MIN = 200_000;
const MAX = 2_000_000;
const SUGGESTED: [number, number] = [800_000, 1_200_000];

interface AllocationItem {
  id: number;
  label: string;
  pct: number;
}

const initialItems: AllocationItem[] = [
  { id: 1, label: "租金保證金", pct: 40 },
  { id: 2, label: "店面裝修", pct: 40 },
  { id: 3, label: "設備採購", pct: 20 },
];

export function Apply() {
  const { applications, submit } = useApplications();
  const [amount, setAmount] = useState(1_000_000);
  const [items, setItems] = useState<AllocationItem[]>(initialItems);
  const [success, setSuccess] = useState(false);
  const nextId = useRef(initialItems.length + 1);

  const total = items.reduce((sum, item) => sum + item.pct, 0);
  const hasEmptyLabel = items.some((item) => item.label.trim() === "");
  const isValid = total === 100 && !hasEmptyLabel && items.length > 0;

  const updateLabel = (id: number, label: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, label } : item)));
  };

  const updatePct = (id: number, pct: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, pct: clamp(pct, 0, 100) } : item)));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { id: nextId.current++, label: "", pct: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== id) : prev));
  };

  const withinSuggested = useMemo(
    () => amount >= SUGGESTED[0] && amount <= SUGGESTED[1],
    [amount],
  );

  const handleSubmit = () => {
    if (!isValid) return;
    submit({
      amount,
      allocation: items.map(({ label, pct }) => ({ label: label.trim(), pct })),
    });
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-accent-700">
          <Sparkle size={26} weight="fill" />
        </div>
        <h1 className="mt-4 text-2xl font-medium tracking-tight text-ink">申請已送出（示範）</h1>
        <p className="mt-2 text-sm text-ink-secondary">
          申請金額 {formatTWD(amount)}，平台將於 1–2 個工作天內完成 AI 風險評估與人工審查。
        </p>
        <Button className="mt-6" onClick={() => setSuccess(false)}>
          再送一筆申請
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">申請融資</h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-secondary">
        依你目前的數位營收數據與 RRS 分數，AI 預估可申請額度如下。
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-accent-200 bg-accent-50 p-4">
        <Info size={18} weight="duotone" className="mt-0.5 shrink-0 text-accent-700" />
        <p className="text-sm text-accent-800">
          AI 建議可申請額度：{formatTWD(SUGGESTED[0])} – {formatTWD(SUGGESTED[1])}
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-hairline bg-surface p-6">
        <label htmlFor="apply-amount" className="text-sm font-medium text-ink">
          申請金額
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-hairline bg-plane px-3 py-2 focus-within:border-accent-400">
          <span className="text-sm text-ink-muted">NT$</span>
          <input
            id="apply-amount"
            type="number"
            min={MIN}
            max={MAX}
            step={50_000}
            value={amount}
            onChange={(e) => setAmount(clamp(Number(e.target.value) || 0, MIN, MAX))}
            className="tabular w-full bg-transparent font-mono text-sm text-ink outline-none"
          />
        </div>
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={50_000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mt-3 w-full accent-accent-600"
        />
        {!withinSuggested && (
          <p className="mt-2 text-xs text-ink-muted">
            超出 AI 建議範圍不代表無法申請，但可能需要較長的人工審查時間。
          </p>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-hairline bg-surface p-6">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-ink">資金用途分配</span>
          <span className={`tabular text-sm font-medium ${total === 100 ? "text-accent-700" : "text-status-critical"}`}>
            {total}%
          </span>
        </div>
        <p className="mt-1 text-xs text-ink-muted">自行填寫用途名稱與比例，例如「租金保證金」「設備採購」。</p>

        <div className="mt-4 flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateLabel(item.id, e.target.value)}
                  placeholder="填寫用途名稱"
                  className="min-w-0 flex-1 rounded-lg border border-hairline bg-plane px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent-400"
                />
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={item.pct}
                    onChange={(e) => updatePct(item.id, Number(e.target.value) || 0)}
                    className="tabular w-16 rounded-lg border border-hairline bg-plane px-2 py-1.5 text-right font-mono text-sm text-ink outline-none focus:border-accent-400"
                  />
                  <span className="text-sm text-ink-muted">%</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  aria-label="刪除這個用途項目"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-plane hover:text-status-critical disabled:pointer-events-none disabled:opacity-30"
                >
                  <Trash size={15} />
                </button>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={item.pct}
                onChange={(e) => updatePct(item.id, Number(e.target.value))}
                className="w-full accent-accent-600"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-700 hover:text-accent-800"
        >
          <Plus size={15} weight="bold" /> 新增用途項目
        </button>

        {hasEmptyLabel && (
          <p className="mt-3 text-xs text-status-critical">每個用途項目都要填寫名稱</p>
        )}
        {total !== 100 && (
          <p className="mt-3 text-xs text-status-critical">分配總和需為 100% 才能送出申請（目前 {total}%）</p>
        )}
      </div>

      <Button className="mt-8 w-full" size="lg" disabled={!isValid} onClick={handleSubmit}>
        送出申請
      </Button>
      <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-muted">
        本頁為產品原型示範，送出後不會產生真實融資申請。
      </p>

      {applications.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-medium text-ink-secondary">歷史申請紀錄（本機示範）</h2>
          <div className="mt-3 flex flex-col divide-y divide-hairline rounded-2xl border border-hairline bg-surface">
            {applications
              .slice()
              .reverse()
              .map((a, i) => (
                <div key={i} className="flex items-center justify-between p-4 text-sm">
                  <span className="tabular font-mono text-ink">{formatTWD(a.amount)}</span>
                  <span className="text-xs text-ink-muted">
                    {new Date(a.submittedAt).toLocaleString("zh-Hant-TW")}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
