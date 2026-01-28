import { getReviewInsights } from "@/lib/db/queries";
import { ReviewInsights } from "@/components/dashboard/review-insights";

export default async function ReviewsPage() {
  const insights = await getReviewInsights();

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden p-4 h-full">
      <div className="mx-auto w-full space-y-4">
        <div>
          <h2 className="text-lg font-medium text-foreground">
            Review Analytics
          </h2>
          <p className="text-sm text-muted-foreground">
            Rating distribution, reply rates, and review insights across all
            stores.
          </p>
        </div>
        <ReviewInsights {...insights} />
      </div>
    </div>
  );
}
