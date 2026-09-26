import clsx from "clsx";

type Tone = "good" | "warning" | "info" | "critical";

const toneConfig: Record<Tone, string> = {
  good: "bg-status-good/10 text-[#0ca30c]",
  warning: "bg-status-warning/15 text-[#946200]",
  info: "bg-accent-50 text-accent-700",
  critical: "bg-status-critical/10 text-status-critical",
};

export function Pill({ tone = "good", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        toneConfig[tone],
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({ on }: { on: boolean }) {
  return (
    <span
      className={clsx(
        "inline-block h-2 w-2 shrink-0 rounded-full",
        on ? "bg-status-good" : "bg-ink-muted",
      )}
      aria-hidden
    />
  );
}
