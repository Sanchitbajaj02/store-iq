import {
  Eye,
  MousePointerClick,
  Star,
  MessageSquareReply,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface OverviewStatsProps {
  totalImpressions: number;
  totalActions: number;
  avgRating: number;
  replyRate: number;
  impressionsTrend: number;
  actionsTrend: number;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function TrendIndicator({ value }: { value: number }) {
  if (value === 0) return null;
  const isPositive = value > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        isPositive
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400"
      }`}
    >
      {isPositive ? (
        <TrendingUp className="size-3" />
      ) : (
        <TrendingDown className="size-3" />
      )}
      {isPositive ? "+" : ""}
      {value}%
    </span>
  );
}

export function OverviewStats({
  totalImpressions,
  totalActions,
  avgRating,
  replyRate,
  impressionsTrend,
  actionsTrend,
}: OverviewStatsProps) {
  const cards = [
    {
      title: "Total Impressions",
      value: formatNumber(totalImpressions),
      subtitle: "Maps + Search",
      icon: Eye,
      trend: impressionsTrend,
    },
    {
      title: "Customer Actions",
      value: formatNumber(totalActions),
      subtitle: "Calls + Directions + Clicks",
      icon: MousePointerClick,
      trend: actionsTrend,
    },
    {
      title: "Average Rating",
      value: avgRating.toFixed(1),
      subtitle: "Across all stores",
      icon: Star,
      trend: 0,
    },
    {
      title: "Reply Rate",
      value: `${replyRate}%`,
      subtitle: "Reviews with replies",
      icon: MessageSquareReply,
      trend: 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="relative overflow-hidden rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-medium text-foreground">
                    {card.value}
                  </p>
                  <TrendIndicator value={card.trend} />
                </div>
                <p className="text-xs text-muted-foreground">{card.subtitle}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted border border-border">
                <Icon className="size-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
