import { cn } from "@/lib/utils";

interface RatingBadgeProps {
  rating: number;
  className?: string;
}

export function RatingBadge({ rating, className }: RatingBadgeProps) {
  const color =
    rating < 3.0
      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      : rating < 4.0
        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        color,
        className
      )}
    >
      {rating.toFixed(1)}
    </span>
  );
}
