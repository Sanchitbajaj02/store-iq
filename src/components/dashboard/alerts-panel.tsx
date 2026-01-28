import { AlertTriangle, TrendingDown, MessageSquareOff } from "lucide-react";
import Link from "next/link";
import { RatingBadge } from "./rating-badge";

interface AlertsPanelProps {
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
}

export function AlertsPanel({
  lowRatedStores,
  unrepliedNegativeReviews,
  decliningEngagement,
}: AlertsPanelProps) {
  const hasAlerts =
    lowRatedStores.length > 0 ||
    unrepliedNegativeReviews.length > 0 ||
    decliningEngagement.length > 0;

  if (!hasAlerts) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-medium text-foreground mb-4">
          Attention Required
        </h3>
        <p className="text-sm text-muted-foreground">
          No alerts at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
        <AlertTriangle className="size-4 text-amber-500" />
        Attention Required
      </h3>

      {lowRatedStores.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Low Rated Stores ({lowRatedStores.length})
          </p>
          <div className="space-y-1.5">
            {lowRatedStores.slice(0, 5).map((store) => (
              <Link
                key={store.locationId}
                href={`/dashboard/locations/${store.locationId}`}
                className="flex items-center justify-between text-sm hover:bg-muted/50 rounded px-2 py-1 -mx-2 transition-colors"
              >
                <span className="text-foreground truncate">{store.name}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {store.city}
                  </span>
                  <RatingBadge rating={store.averageRating} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {decliningEngagement.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <TrendingDown className="size-3" />
            Declining Engagement ({decliningEngagement.length})
          </p>
          <div className="space-y-1.5">
            {decliningEngagement.slice(0, 5).map((store) => (
              <Link
                key={store.locationId}
                href={`/dashboard/locations/${store.locationId}`}
                className="flex items-center justify-between text-sm hover:bg-muted/50 rounded px-2 py-1 -mx-2 transition-colors"
              >
                <span className="text-foreground truncate">{store.name}</span>
                <span className="text-xs text-red-600 dark:text-red-400 shrink-0">
                  {store.decline}%
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {unrepliedNegativeReviews.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <MessageSquareOff className="size-3" />
            Unreplied Negative Reviews ({unrepliedNegativeReviews.length})
          </p>
          <div className="space-y-1.5">
            {unrepliedNegativeReviews.slice(0, 5).map((review) => (
              <Link
                key={review.reviewId}
                href={`/dashboard/locations/${review.locationId}`}
                className="flex items-start gap-2 text-sm hover:bg-muted/50 rounded px-2 py-1.5 -mx-2 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate">
                    {review.reviewText || "No text"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {review.locationName} - {review.reviewerName}
                  </p>
                </div>
                <RatingBadge rating={review.rating} className="shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
