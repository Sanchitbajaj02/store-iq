import { DashboardContent } from "@/components/dashboard/dashboard-content";
import {
  getOverviewStats,
  getAlerts,
  getKpiTrends,
  getCityPerformance,
  getCategoryPerformance,
} from "@/lib/db/queries";

export default async function DashboardPage() {
  const [
    overviewStats,
    alerts,
    kpiTrends,
    cityPerformance,
    categoryPerformance,
  ] = await Promise.all([
    getOverviewStats(),
    getAlerts(),
    getKpiTrends(),
    getCityPerformance(),
    getCategoryPerformance(),
  ]);

  return (
    <DashboardContent
      overviewStats={overviewStats}
      alerts={alerts}
      kpiTrends={kpiTrends}
      cityPerformance={cityPerformance}
      categoryPerformance={categoryPerformance}
    />
  );
}
