"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import { useTheme } from "next-themes";

interface KpiTrendChartProps {
  data: {
    weekStart: string;
    impressions: number;
    actions: number;
    phoneCalls: number;
    directionRequests: number;
    websiteClicks: number;
    bookings: number;
  }[];
  title?: string;
  showDetailed?: boolean;
}

export function KpiTrendChart({
  data,
  title = "KPI Trends",
  showDetailed = false,
}: KpiTrendChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const chartData = data.map((d) => ({
    ...d,
    label: format(parseISO(d.weekStart), "MMM d"),
  }));

  const lines = showDetailed
    ? [
        { key: "phoneCalls", color: "#6366f1", name: "Phone Calls" },
        { key: "directionRequests", color: "#10b981", name: "Direction Requests" },
        { key: "websiteClicks", color: "#f59e0b", name: "Website Clicks" },
        { key: "bookings", color: "#ef4444", name: "Bookings" },
      ]
    : [
        { key: "impressions", color: "#6366f1", name: "Impressions" },
        { key: "actions", color: "#10b981", name: "Actions" },
      ];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-sm font-medium text-foreground mb-4">{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
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
                name,
              ]) as any}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            {lines.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                name={line.name}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
