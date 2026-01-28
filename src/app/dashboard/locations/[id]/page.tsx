import { notFound } from "next/navigation";
import { getLocationDetail } from "@/lib/db/queries";
import { RatingBadge } from "@/components/dashboard/rating-badge";
import { KpiTrendChart } from "@/components/dashboard/kpi-trend-chart";
import {
  MapPin,
  Phone,
  Globe,
  BadgeCheck,
  ArrowLeft,
  Star,
} from "lucide-react";
import Link from "next/link";

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getLocationDetail(id);

  if (!data) return notFound();

  const { location, reviews, kpiHistory, networkAvg } = data;

  const replyCount = reviews.filter((r) => r.hasReply).length;
  const replyRate =
    reviews.length > 0 ? Math.round((replyCount / reviews.length) * 100) : 0;

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden p-4 h-full">
      <div className="mx-auto w-full space-y-6">
        {/* Back link */}
        <Link
          href="/dashboard/locations"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Locations
        </Link>

        {/* Header */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-medium text-foreground">
                  {location.name}
                </h2>
                {location.isVerified && (
                  <BadgeCheck className="size-5 text-blue-500" />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {location.address}, {location.city}, {location.state}{" "}
                  {location.pincode}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {location.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="size-3.5" />
                    {location.phone}
                  </span>
                )}
                {location.website && (
                  <span className="flex items-center gap-1">
                    <Globe className="size-3.5" />
                    {location.website}
                  </span>
                )}
              </div>
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs bg-muted text-muted-foreground">
                {location.primaryCategory}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <RatingBadge
                  rating={location.averageRating}
                  className="text-lg px-3 py-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {location.totalReviews} reviews
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics vs Network Average */}
        {networkAvg && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Rating</p>
              <p className="text-2xl font-medium text-foreground">
                {location.averageRating.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">
                Network avg: {networkAvg.avgRating}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">
                Avg Weekly Impressions
              </p>
              <p className="text-2xl font-medium text-foreground">
                {kpiHistory.length > 0
                  ? Math.round(
                      kpiHistory.reduce((sum, k) => sum + k.impressions, 0) /
                        kpiHistory.length
                    ).toLocaleString()
                  : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">
                Network avg: {networkAvg.avgImpressions.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Reply Rate</p>
              <p className="text-2xl font-medium text-foreground">
                {replyRate}%
              </p>
              <p className="text-xs text-muted-foreground">
                {replyCount} of {reviews.length} replied
              </p>
            </div>
          </div>
        )}

        {/* KPI Trend */}
        {kpiHistory.length > 0 && (
          <KpiTrendChart
            data={kpiHistory}
            title="Weekly Performance"
            showDetailed
          />
        )}

        {/* Reviews */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">
            Reviews ({reviews.length})
          </h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {reviews.map((review) => (
              <div
                key={review.reviewId}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-1 shrink-0 mt-0.5">
                  <Star className="size-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium">{review.rating}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">
                    {review.reviewText || "No text"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {review.reviewerName} - {review.reviewDate}
                    {review.language !== "en" && (
                      <span className="ml-1 text-xs">({review.language})</span>
                    )}
                  </p>
                  {review.hasReply && review.replyText && (
                    <div className="mt-2 pl-3 border-l-2 border-blue-300 dark:border-blue-700">
                      <p className="text-xs text-muted-foreground">
                        {review.replyText}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
