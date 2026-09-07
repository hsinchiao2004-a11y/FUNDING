import { useState } from "react";
import { CheckCircle, XCircle, ArrowsClockwise } from "@phosphor-icons/react";
import { dataSources as initialSources } from "../data/account";
import { Button } from "../components/Button";

export function Connections() {
  const [sources, setSources] = useState(initialSources);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    if (sources.find((s) => s.id === id)?.connected) return;
    setSyncingId(id);
    setTimeout(() => {
      setSources((prev) =>
        prev.map((s) => (s.id === id ? { ...s, connected: true, lastSync: "剛剛" } : s)),
      );
      setSyncingId(null);
    }, 900);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-medium tracking-tight text-ink sm:text-3xl">資料來源</h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-secondary">
        串接的資料來源越完整，AI 風險評估越準確，未來申請額度的核准效率也越高。
      </p>

      <div className="mt-8 flex flex-col divide-y divide-hairline rounded-2xl border border-hairline bg-surface">
        {sources.map((source) => (
          <div key={source.id} className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              {source.connected ? (
                <CheckCircle size={20} weight="fill" className="shrink-0 text-accent-600" />
              ) : (
                <XCircle size={20} weight="fill" className="shrink-0 text-ink-muted" />
              )}
              <div>
                <p className="font-medium text-ink">{source.name}</p>
                <p className="text-xs text-ink-muted">
                  {source.connected ? `上次同步：${source.lastSync}` : "尚未連接"}
                </p>
              </div>
            </div>
            {source.connected ? (
              <span className="text-xs font-medium text-accent-700">已連接</span>
            ) : (
              <Button
                variant="ghost"
                size="md"
                onClick={() => handleToggle(source.id)}
                disabled={syncingId === source.id}
              >
                <ArrowsClockwise size={15} className={syncingId === source.id ? "animate-spin" : ""} />
                {syncingId === source.id ? "連接中" : "立即連接"}
              </Button>
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-ink-muted">
        本頁連接狀態僅為示範互動，不會真的串接任何金流或發票系統。
      </p>
    </div>
  );
}
