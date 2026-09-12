import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatTWD, formatPct } from "../lib/format";

// 分類色沿用 dataviz 色板固定順序（blue/orange/aqua），第 4 項以上一律併入「其他」，
// 避免圓餅圖切片過多、CVD 辨識度不足。
const SLICE_COLORS = ["#2a78d6", "#eb6834", "#1baf7a"];
const OTHER_COLOR = "#898781";

export interface PieSlice {
  label: string;
  value: number;
}

export function PortfolioPieChart({ slices }: { slices: PieSlice[] }) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const top = slices.slice(0, 3);
  const rest = slices.slice(3);
  const restTotal = rest.reduce((sum, s) => sum + s.value, 0);
  const data = [
    ...top.map((s, i) => ({ name: s.label, value: s.value, color: SLICE_COLORS[i] })),
    ...(restTotal > 0 ? [{ name: "其他", value: restTotal, color: OTHER_COLOR }] : []),
  ];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="h-40 w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={44}
              outerRadius={72}
              paddingAngle={2}
              stroke="#fcfcfb"
              strokeWidth={2}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => {
                const v = Number(value);
                return [`${formatTWD(v)}（${formatPct((v / total) * 100, 0)}）`, String(name)];
              }}
              contentStyle={{
                background: "#fcfcfb",
                border: "1px solid #e1e0d9",
                borderRadius: 8,
                fontSize: 12,
                color: "#0b0b0b",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-ink-secondary">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
                aria-hidden
              />
              {entry.name}
            </span>
            <span className="tabular font-mono text-ink">
              {formatPct((entry.value / total) * 100, 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
