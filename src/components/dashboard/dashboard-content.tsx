import { OverviewStats } from "./overview-stats";
import { AlertsPanel } from "./alerts-panel";
import { WeeklyTrendChart } from "./weekly-trend-chart";
import { CityPerformance } from "./city-performance";
import { CategoryPerformance } from "./category-performance";

interface DashboardContentProps {
  overviewStats: {
    totalImpressions: number;
    totalActions: number;
    avgRating: number;
    replyRate: number;
    impressionsTrend: number;
    actionsTrend: number;
  };
  alerts: {
    lowRatedStores: {
      locationId: string;
      name: string;
      city: string;
      averageRating: number;
    }[];
    unrepliedNegativeReviews: {
      reviewId: string;
      locationId: string;
      rating: number;
      reviewText: string | null;
      reviewerName: string;
      reviewDate: string;
      locationName: string;
      city: string;
    }[];
    decliningEngagement: {
      locationId: string;
      name: string;
      city: string;
      decline: number;
    }[];
  };
  kpiTrends: {
    weekStart: string;
    impressions: number;
    actions: number;
  }[];
  cityPerformance: {
    city: string;
    avgRating: number;
    totalReviews: number;
    locationCount: number;
    totalImpressions: number;
    totalActions: number;
  }[];
  categoryPerformance: {
    category: string;
    avgRating: number;
    totalReviews: number;
    locationCount: number;
    totalImpressions: number;
    totalActions: number;
  }[];
}

export function DashboardContent({
  overviewStats,
  alerts,
  kpiTrends,
  cityPerformance,
  categoryPerformance,
}: DashboardContentProps) {
  return (
    <div className="w-full overflow-y-auto overflow-x-hidden p-4 h-full">
      <div className="mx-auto w-full space-y-6">
        {/* Row 1: KPI Cards */}
        <OverviewStats {...overviewStats} />

        {/* Row 2: Alerts & Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlertsPanel {...alerts} />
          <WeeklyTrendChart data={kpiTrends} />
        </div>

        {/* Row 3: City & Category Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CityPerformance data={cityPerformance} />
          <CategoryPerformance data={categoryPerformance} />
        </div>
      </div>
    </div>
  );
}
