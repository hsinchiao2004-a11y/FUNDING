import { ArrowRight, ArrowElbowLeftUp, UserCircle, HandCoins, Storefront, ChartLineUp, Coins } from "@phosphor-icons/react";

const nodes = [
  { icon: UserCircle, label: "投資人＆忠實消費者" },
  { icon: HandCoins, label: "投資商家分潤權" },
  { icon: Storefront, label: "成為會員與消費者" },
  { icon: ChartLineUp, label: "商家營收增加" },
  { icon: Coins, label: "投資收益回收" },
];

export function FlowLoop() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-0">
        {nodes.map((node, i) => (
          <div key={node.label} className="flex flex-1 items-center gap-3 lg:flex-col lg:items-stretch lg:gap-0">
            <div className="flex flex-1 flex-col items-center gap-2.5 rounded-2xl border border-hairline bg-surface p-5 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                <node.icon size={20} weight="duotone" />
              </div>
              <p className="text-sm font-medium text-ink">{node.label}</p>
            </div>
            {i < nodes.length - 1 && (
              <div className="flex shrink-0 items-center justify-center py-2 lg:w-10 lg:py-0">
                <ArrowRight size={18} className="hidden text-ink-muted lg:block" />
                <span className="text-ink-muted lg:hidden" aria-hidden>
                  ↓
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-1 flex items-center justify-center gap-2 text-xs text-ink-muted">
        <ArrowElbowLeftUp size={16} />
        <span>回收後再投資，形成持續循環</span>
      </div>
    </div>
  );
}
