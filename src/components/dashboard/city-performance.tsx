"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";

interface CityPerformanceProps {
  data: {
    city: string;
    avgRating: number;
    totalReviews: number;
    locationCount: number;
    totalImpressions: number;
    totalActions: number;
  }[];
}

export function CityPerformance({ data }: CityPerformanceProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const sorted = [...data].sort((a, b) => b.totalActions - a.totalActions);

  return (
    <div className="rounded-xl border border-border bg-card p-6 transition-all">
      <h3 className="text-sm font-medium text-foreground mb-4">
        Performance by City
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sorted} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#2A2A2A" : "#E8E9ED"}
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fill: isDark ? "#B4B4B4" : "#262626", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v
              }
            />
            <YAxis
              type="category"
              dataKey="city"
              tick={{ fill: isDark ? "#B4B4B4" : "#262626", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={90}
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
                name === "totalActions" ? "Customer Actions" : "Impressions",
              ])}
            />
            <Bar
              dataKey="totalActions"
              fill="#6366f1"
              radius={[0, 4, 4, 0]}
              barSize={16}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
