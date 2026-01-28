"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import { useTheme } from "next-themes";

interface WeeklyTrendChartProps {
  data: {
    weekStart: string;
    impressions: number;
    actions: number;
  }[];
}

export function WeeklyTrendChart({ data }: WeeklyTrendChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const chartData = data.map((d) => ({
    ...d,
    label: format(parseISO(d.weekStart), "MMM d"),
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-sm font-medium text-foreground mb-4">
        Weekly Performance Trend
      </h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="impressionsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="actionsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#2A2A2A" : "#E8E9ED"}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: isDark ? "#B4B4B4" : "#95979d", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: isDark ? "#B4B4B4" : "#95979d", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={50}
              tickFormatter={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1f1f1f" : "#fff",
                border: `1px solid ${isDark ? "#333" : "#e5e7eb"}`,
                borderRadius: "8px",
                fontSize: "12px",
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={((value: any, name: any) => [
                Number(value ?? 0).toLocaleString(),
                name === "impressions" ? "Impressions" : "Actions",
              ]) as any}
              labelFormatter={(label) => label}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              formatter={(value) =>
                value === "impressions" ? "Impressions" : "Actions"
              }
            />
            <Area
              type="monotone"
              dataKey="impressions"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#impressionsGrad)"
            />
            <Area
              type="monotone"
              dataKey="actions"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#actionsGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
