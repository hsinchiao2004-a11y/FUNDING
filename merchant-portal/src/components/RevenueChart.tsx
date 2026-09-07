import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatCompactTWD } from "../lib/format";

const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

export function RevenueChart({ data }: { data: number[] }) {
  const chartData = data.map((revenue, i) => ({ month: months[i], revenue }));

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e1e0d9" vertical={false} strokeDasharray="0" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={{ stroke: "#c3c2b7" }}
            tick={{ fill: "#898781", fontSize: 12 }}
            interval={1}
          />
          <YAxis
            tickFormatter={(v) => formatCompactTWD(v)}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#898781", fontSize: 12 }}
            width={64}
          />
          <Tooltip
            formatter={(value) => [formatCompactTWD(Number(value)), "月營收"]}
            labelFormatter={(label) => label}
            contentStyle={{
              background: "#fcfcfb",
              border: "1px solid #e1e0d9",
              borderRadius: 8,
              fontSize: 12,
              color: "#0b0b0b",
            }}
            cursor={{ stroke: "#c3c2b7", strokeDasharray: 4 }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#059669"
            strokeWidth={2}
            fill="url(#revenueFill)"
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
