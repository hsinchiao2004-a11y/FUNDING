import { useState } from "react";
import { Megaphone, CheckCircle } from "@phosphor-icons/react";
import { Pill } from "./Badge";
import { Button } from "./Button";

type Stage = "idle" | "editing" | "sent";

const DEFAULT_OFFER = "到店消費享 9 折";

export function PromoSuggestionCard({
  title,
  body,
  merchantName,
}: {
  title: string;
  body: string;
  merchantName: string;
}) {
  const [stage, setStage] = useState<Stage>("idle");
  const [offer, setOffer] = useState(DEFAULT_OFFER);
  const [message, setMessage] = useState(
    `好久不見！${merchantName}最近推出新菜單，身為投資人的你享有專屬優惠——這週${DEFAULT_OFFER}，順便看看你投資的店最近的樣子 😊`,
  );

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-hairline bg-surface p-5">
      <Pill tone="info">
        <Megaphone size={13} weight="bold" />
        促購建議
      </Pill>
      <p className="font-medium text-ink">{title}</p>
      <p className="text-sm leading-relaxed text-ink-secondary">{body}</p>

      {stage === "idle" && (
        <Button size="md" className="mt-1 w-fit" onClick={() => setStage("editing")}>
          採用此建議
        </Button>
      )}

      {stage === "editing" && (
        <div className="mt-1 flex flex-col gap-3 border-t border-hairline pt-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-secondary">優惠內容（可自行調整）</label>
            <input
              type="text"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="rounded-lg border border-hairline bg-plane px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-secondary">邀請消費簡訊內容（可自行撰寫）</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none rounded-lg border border-hairline bg-plane px-2.5 py-1.5 text-sm leading-relaxed text-ink outline-none focus:border-accent-400"
            />
          </div>
          <div className="flex gap-2">
            <Button size="md" onClick={() => setStage("sent")}>
              確認發送給投資人
            </Button>
            <Button variant="ghost" size="md" onClick={() => setStage("idle")}>
              取消
            </Button>
          </div>
        </div>
      )}

      {stage === "sent" && (
        <div className="mt-1 flex flex-col gap-3 border-t border-hairline pt-4">
          <div className="rounded-xl border border-hairline bg-plane p-3.5">
            <p className="text-xs font-medium text-ink-secondary">優惠內容：{offer}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{message}</p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 text-sm text-accent-700">
            <CheckCircle size={15} weight="fill" />
            已發送，等待促購 Agent 通知投資人
          </span>
        </div>
      )}
    </div>
  );
}
