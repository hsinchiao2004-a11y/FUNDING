import type { ReactNode } from "react";
import clsx from "clsx";

export function StatTile({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <span className="text-xs text-ink-muted">{label}</span>
      <span className="tabular font-mono text-2xl font-medium tracking-tight text-ink">
        {value}
      </span>
      {hint && <span className="text-xs text-ink-secondary">{hint}</span>}
    </div>
  );
}
