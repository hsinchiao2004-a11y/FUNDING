import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { RepaymentEntry } from "../data/account";
import { formatCompactTWD } from "../lib/format";

export function RepaymentChart({ data }: { data: RepaymentEntry[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="#e1e0d9" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={{ stroke: "#c3c2b7" }}
            tick={{ fill: "#898781", fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(v) => formatCompactTWD(v)}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#898781", fontSize: 12 }}
            width={64}
          />
          <Tooltip
            formatter={(value) => [formatCompactTWD(Number(value)), "當月分潤"]}
            contentStyle={{
              background: "#fcfcfb",
              border: "1px solid #e1e0d9",
              borderRadius: 8,
              fontSize: 12,
              color: "#0b0b0b",
            }}
            cursor={{ fill: "#05966912" }}
          />
          <Bar dataKey="dividend" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
