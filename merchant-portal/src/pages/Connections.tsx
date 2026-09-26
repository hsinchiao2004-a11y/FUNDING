import { useMemo, useState } from "react";
import { CheckCircle, XCircle, ArrowsClockwise, WarningCircle } from "@phosphor-icons/react";
import { dataSources as initialSources } from "../data/account";
import { Button } from "../components/Button";
import { Pill } from "../components/Badge";

type AlertLevel = "ok" | "yellow" | "red";

interface AlertRow {
  level: AlertLevel;
  indicator: string;
  threshold: string;
  action: string;
  triggered: boolean;
  triggeredNote: string;
}

const levelConfig: Record<AlertLevel, { label: string; tone: "good" | "warning" | "critical" }> = {
  ok: { label: "正常", tone: "good" },
  yellow: { label: "黃燈", tone: "warning" },
  red: { label: "紅燈", tone: "critical" },
};

export function Connections() {
  const [sources, setSources] = useState(initialSources);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // 三方資料三角勾稽的異常警示矩陣：平台不依賴商家自行申報，而是持續比對
  // POS、電子發票、電支清算三個獨立資料源，超出閾值即觸發對應的系統處置動作。
  const einvoiceConnected = sources.find((s) => s.id === "einvoice")?.connected ?? false;
  const allConnected = sources.every((s) => s.connected);

  const alertRows: AlertRow[] = useMemo(
    () => [
      {
        level: "yellow",
        indicator: "發票開立偏離",
        threshold: "發票總額低於 POS 營收 > 5%，或張數短少 > 8%",
        action: "AI 發出校驗通知，限期 48 小時上傳銷項佐證",
        triggered: !einvoiceConnected,
        triggeredNote: "電子發票尚未連接，無法交叉比對 POS 與發票金額",
      },
      {
        level: "yellow",
        indicator: "通訊異常中斷",
        threshold: "POS 或發票 Turnkey 連續斷訊 > 24 小時",
        action: "暫停當期營收核定，啟動遠端通訊檢測",
        triggered: !allConnected,
        triggeredNote: "尚有資料來源未連接，無法確認資料傳輸是否正常",
      },
      {
        level: "red",
        indicator: "金流結構劇變",
        threshold: "電支佔比突發性驟降逾 20%（無促銷因由）",
        action: "智能合約暫停次級轉讓掛牌，防範知情拋售",
        triggered: false,
        triggeredNote: "近期電支佔比穩定，無劇烈驟降",
      },
      {
        level: "red",
        indicator: "營收陡降預警",
        threshold: "連續 7 天營收低於過去 8 週均值達 35% 以上",
        action: "派員實體稽核，同步啟動 AI 發券促購支援",
        triggered: false,
        triggeredNote: "近期營收持續成長，無陡降跡象",
      },
    ],
    [einvoiceConnected, allConnected],
  );

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

      <h2 className="mt-12 text-lg font-medium text-ink">異常警示指標</h2>
      <p className="mt-1 max-w-lg text-sm leading-relaxed text-ink-secondary">
        平台不依賴商家自行申報，而是由預言機持續比對 POS、電子發票、電支清算三個互為獨立的
        外部資料源，依量化指標設定「黃燈」與「紅燈」兩級自動化處置防線。
      </p>

      <div className="mt-5 flex flex-col divide-y divide-hairline rounded-2xl border border-hairline bg-surface">
        {alertRows.map((row) => {
          const cfg = levelConfig[row.triggered ? row.level : "ok"];
          return (
            <div key={row.indicator} className="flex flex-col gap-2 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone={cfg.tone}>
                  {row.triggered && <WarningCircle size={13} weight="bold" />}
                  {cfg.label}
                </Pill>
                <span className="font-medium text-ink">{row.indicator}</span>
              </div>
              <p className="text-xs text-ink-muted">觸發閾值：{row.threshold}</p>
              <p className="text-xs text-ink-muted">系統處置動作：{row.action}</p>
              <p className={row.triggered ? "text-xs font-medium text-status-warning" : "text-xs text-ink-muted"}>
                {row.triggered ? "⚠ " : "✓ "}
                {row.triggeredNote}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
