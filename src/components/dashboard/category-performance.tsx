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

interface CategoryPerformanceProps {
  data: {
    category: string;
    avgRating: number;
    totalReviews: number;
    locationCount: number;
    totalImpressions: number;
    totalActions: number;
  }[];
}

export function CategoryPerformance({ data }: CategoryPerformanceProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-sm font-medium text-foreground mb-4">
        Performance by Category
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#2A2A2A" : "#E8E9ED"}
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fill: isDark ? "#B4B4B4" : "#95979d", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
            />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fill: isDark ? "#B4B4B4" : "#95979d", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={140}
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
                Number(value ?? 0).toFixed(1),
                name === "avgRating" ? "Avg Rating" : name,
              ]) as any}
            />
            <Bar
              dataKey="avgRating"
              fill="#10b981"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
