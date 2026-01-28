import {
  getKpiTrends,
  getTopAndBottomLocations,
} from "@/lib/db/queries";
import { KpiTrendChart } from "@/components/dashboard/kpi-trend-chart";
import { RatingBadge } from "@/components/dashboard/rating-badge";
import Link from "next/link";

export default async function PerformancePage() {
  const [kpiTrends, rankings] = await Promise.all([
    getKpiTrends(),
    getTopAndBottomLocations(),
  ]);

  // Compute conversion funnel from the latest week
  const latest = kpiTrends[kpiTrends.length - 1];
  const funnelData = latest
    ? [
        { label: "Impressions", value: latest.impressions },
        { label: "Actions", value: latest.actions },
        { label: "Bookings", value: latest.bookings },
      ]
    : [];

  // Maps vs Search comparison
  const mapsVsSearch = kpiTrends.map((t) => ({
    weekStart: t.weekStart,
    impressions: t.impressions,
    actions: t.actions,
    phoneCalls: t.phoneCalls,
    directionRequests: t.directionRequests,
    websiteClicks: t.websiteClicks,
    bookings: t.bookings,
    mapImpressions: t.mapImpressions,
    searchImpressions: t.searchImpressions,
  }));

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden p-4 h-full">
      <div className="mx-auto w-full space-y-6">
        <div>
          <h2 className="text-lg font-medium text-foreground">
            Performance Analytics
          </h2>
          <p className="text-sm text-muted-foreground">
            KPI trends, engagement rankings, and conversion metrics.
          </p>
        </div>

        {/* KPI Trends */}
        <KpiTrendChart
          data={mapsVsSearch}
          title="Weekly KPI Trends (All Stores)"
          showDetailed
        />

        {/* Conversion Funnel */}
        {funnelData.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-medium text-foreground mb-4">
              Conversion Funnel (Latest Week)
            </h3>
            <div className="flex items-end gap-4 h-40">
              {funnelData.map((item, i) => {
                const maxVal = funnelData[0].value || 1;
                const height = Math.max((item.value / maxVal) * 100, 5);
                return (
                  <div
                    key={item.label}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {item.value.toLocaleString()}
                    </span>
                    <div
                      className="w-full rounded-t-lg"
                      style={{
                        height: `${height}%`,
                        backgroundColor:
                          i === 0
                            ? "#6366f1"
                            : i === 1
                              ? "#10b981"
                              : "#f59e0b",
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Top & Bottom Stores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-medium text-foreground mb-4">
              Top 10 Stores by Rating
            </h3>
            <div className="space-y-2">
              {rankings.topByRating.map((loc, i) => (
                <Link
                  key={loc.locationId}
                  href={`/dashboard/locations/${loc.locationId}`}
                  className="flex items-center justify-between hover:bg-muted/50 rounded px-2 py-1.5 -mx-2 transition-colors"
                >
                  <span className="text-sm text-foreground">
                    <span className="text-muted-foreground mr-2">
                      {i + 1}.
                    </span>
                    {loc.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {loc.city}
                    </span>
                    <RatingBadge rating={loc.averageRating} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-medium text-foreground mb-4">
              Bottom 10 Stores by Rating
            </h3>
            <div className="space-y-2">
              {rankings.bottomByRating.map((loc, i) => (
                <Link
                  key={loc.locationId}
                  href={`/dashboard/locations/${loc.locationId}`}
                  className="flex items-center justify-between hover:bg-muted/50 rounded px-2 py-1.5 -mx-2 transition-colors"
                >
                  <span className="text-sm text-foreground">
                    <span className="text-muted-foreground mr-2">
                      {i + 1}.
                    </span>
                    {loc.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {loc.city}
                    </span>
                    <RatingBadge rating={loc.averageRating} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Top by Review Volume */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">
            Top 10 Stores by Review Volume
          </h3>
          <div className="space-y-2">
            {rankings.topByReviews.map((loc, i) => (
              <Link
                key={loc.locationId}
                href={`/dashboard/locations/${loc.locationId}`}
                className="flex items-center justify-between hover:bg-muted/50 rounded px-2 py-1.5 -mx-2 transition-colors"
              >
                <span className="text-sm text-foreground">
                  <span className="text-muted-foreground mr-2">{i + 1}.</span>
                  {loc.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {loc.totalReviews} reviews
                  </span>
                  <RatingBadge rating={loc.averageRating} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
