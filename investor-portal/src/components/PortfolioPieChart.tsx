import { formatTWD, formatPct } from "../lib/format";

// 分類色沿用 dataviz 色板固定順序（blue/orange/aqua），第 4 項以上一律併入「其他」，
// 避免圓餅圖切片過多、CVD 辨識度不足。
const SLICE_COLORS = ["#2a78d6", "#eb6834", "#1baf7a"];
const OTHER_COLOR = "#898781";

export interface PieSlice {
  label: string;
  value: number;
}

const SIZE = 160;
const CENTER = SIZE / 2;
const OUTER_R = 72;
const INNER_R = 44;
const RING_R = (OUTER_R + INNER_R) / 2; // stroke drawn along this radius
const STROKE_W = OUTER_R - INNER_R;
const CIRCUMFERENCE = 2 * Math.PI * RING_R;
const GAP_DEG = 2; // visual gap between slices, matches previous paddingAngle

export function PortfolioPieChart({ slices }: { slices: PieSlice[] }) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const top = slices.slice(0, 3);
  const rest = slices.slice(3);
  const restTotal = rest.reduce((sum, s) => sum + s.value, 0);
  const data = [
    ...top.map((s, i) => ({ name: s.label, value: s.value, color: SLICE_COLORS[i] })),
    ...(restTotal > 0 ? [{ name: "其他", value: restTotal, color: OTHER_COLOR }] : []),
  ];

  const gapLength = (GAP_DEG / 360) * CIRCUMFERENCE;
  let cumulative = 0;

  return (
    <div className="flex flex-col gap-4 sm:mx-auto sm:w-fit sm:flex-row sm:items-center sm:gap-6">
      <div className="h-40 w-40 shrink-0">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
          <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
            {data.map((entry) => {
              const fraction = total > 0 ? entry.value / total : 0;
              const rawLength = fraction * CIRCUMFERENCE;
              const length = Math.max(rawLength - gapLength, 0);
              const offset = -cumulative;
              cumulative += rawLength;
              return (
                <circle
                  key={entry.name}
                  cx={CENTER}
                  cy={CENTER}
                  r={RING_R}
                  fill="none"
                  stroke={entry.color}
                  strokeWidth={STROKE_W}
                  strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                >
                  <title>
                    {entry.name}：{formatTWD(entry.value)}（{formatPct(fraction * 100, 0)}）
                  </title>
                </circle>
              );
            })}
          </g>
        </svg>
      </div>
      <div className="flex flex-col gap-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate text-ink-secondary">{entry.name}</span>
            <span className="tabular shrink-0 font-mono text-ink">
              {formatPct((entry.value / total) * 100, 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
