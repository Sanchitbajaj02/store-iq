import { DashboardContent } from "@/components/dashboard/dashboard-content";
import {
  getOverviewStats,
  getAlerts,
  getKpiTrends,
  getCityPerformance,
  getCategoryPerformance,
  getLocationsList,
} from "@/lib/db/queries";

export default async function DashboardPage() {
  const [overviewStats, alerts, kpiTrends, cityPerformance, categoryPerformance, locations] =
    await Promise.all([
      getOverviewStats(),
      getAlerts(),
      getKpiTrends(),
      getCityPerformance(),
      getCategoryPerformance(),
      getLocationsList(),
    ]);

  return (
    <DashboardContent
      overviewStats={overviewStats}
      alerts={alerts}
      kpiTrends={kpiTrends}
      cityPerformance={cityPerformance}
      categoryPerformance={categoryPerformance}
      locations={locations}
    />
  );
}
