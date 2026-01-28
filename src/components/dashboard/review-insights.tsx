"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTheme } from "next-themes";
import { RatingBadge } from "./rating-badge";

interface ReviewInsightsProps {
  ratingDistribution: { rating: number; count: number }[];
  replyRate: { total: number; replied: number; rate: number };
  languageBreakdown: { language: string; count: number }[];
  recentNegativeReviews: {
    reviewId: string;
    locationId: string;
    rating: number;
    reviewText: string | null;
    reviewerName: string;
    reviewDate: string;
    locationName: string;
    city: string;
  }[];
}

const RATING_COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];
const LANG_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

export function ReviewInsights({
  ratingDistribution,
  replyRate,
  languageBreakdown,
  recentNegativeReviews,
}: ReviewInsightsProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const ratingData = [1, 2, 3, 4, 5].map((r) => ({
    rating: `${r} Star`,
    count: ratingDistribution.find((d) => d.rating === r)?.count || 0,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">
            Rating Distribution
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingData}>
                <XAxis
                  dataKey="rating"
                  tick={{
                    fill: isDark ? "#B4B4B4" : "#95979d",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fill: isDark ? "#B4B4B4" : "#95979d",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1f1f1f" : "#fff",
                    border: `1px solid ${isDark ? "#333" : "#e5e7eb"}`,
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
                  {ratingData.map((_, index) => (
                    <Cell key={index} fill={RATING_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reply Rate + Language */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-medium text-foreground mb-3">
              Reply Rate Overview
            </h3>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-semibold text-foreground">
                {replyRate.rate}%
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  {replyRate.replied} of {replyRate.total} reviews replied
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${replyRate.rate}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-medium text-foreground mb-3">
              Language Breakdown
            </h3>
            <div className="flex items-center gap-6">
              <div className="h-[100px] w-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={languageBreakdown}
                      dataKey="count"
                      nameKey="language"
                      innerRadius={25}
                      outerRadius={45}
                      paddingAngle={2}
                    >
                      {languageBreakdown.map((_, index) => (
                        <Cell
                          key={index}
                          fill={LANG_COLORS[index % LANG_COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {languageBreakdown.map((lang, index) => (
                  <div key={lang.language} className="flex items-center gap-2">
                    <div
                      className="size-3 rounded-full"
                      style={{
                        backgroundColor:
                          LANG_COLORS[index % LANG_COLORS.length],
                      }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {lang.language === "en" ? "English" : lang.language === "hi" ? "Hindi" : lang.language}{" "}
                      ({lang.count})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Negative Reviews */}
      {recentNegativeReviews.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">
            Recent Negative Reviews (1-2 Stars)
          </h3>
          <div className="space-y-3">
            {recentNegativeReviews.map((review) => (
              <div
                key={review.reviewId}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
              >
                <RatingBadge rating={review.rating} className="shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">
                    {review.reviewText || "No text provided"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {review.reviewerName} - {review.locationName},{" "}
                    {review.city} - {review.reviewDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
