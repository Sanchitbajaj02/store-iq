"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpDown, Search } from "lucide-react";
import { RatingBadge } from "./rating-badge";
import { Input } from "@/components/ui/input";

interface Location {
  locationId: string;
  storeCode: string;
  name: string;
  city: string;
  primaryCategory: string;
  averageRating: number;
  totalReviews: number;
  replyRate: number;
  avgWeeklyImpressions: number;
  avgWeeklyActions: number;
}

interface LocationsTableProps {
  locations: Location[];
}

type SortKey = keyof Pick<
  Location,
  | "name"
  | "city"
  | "averageRating"
  | "totalReviews"
  | "replyRate"
  | "avgWeeklyImpressions"
  | "avgWeeklyActions"
>;

export function LocationsTable({ locations }: LocationsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("averageRating");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = locations;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.primaryCategory.toLowerCase().includes(q)
      );
    }
    return [...result].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [locations, sortKey, sortDir, search]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const columns: { key: SortKey; label: string; align?: string }[] = [
    { key: "name", label: "Name" },
    { key: "city", label: "City" },
    { key: "averageRating", label: "Rating", align: "text-center" },
    { key: "totalReviews", label: "Reviews", align: "text-right" },
    { key: "replyRate", label: "Reply Rate", align: "text-right" },
    { key: "avgWeeklyImpressions", label: "Avg Impressions/wk", align: "text-right" },
    { key: "avgWeeklyActions", label: "Avg Actions/wk", align: "text-right" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">
          All Locations ({filtered.length})
        </h3>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors ${col.align || ""}`}
                  onClick={() => toggleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className="size-3" />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Category
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((loc) => (
              <tr
                key={loc.locationId}
                className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/locations/${loc.locationId}`}
                    className="text-foreground font-medium hover:underline"
                  >
                    {loc.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{loc.city}</td>
                <td className="px-4 py-3 text-center">
                  <RatingBadge rating={loc.averageRating} />
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {loc.totalReviews}
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {loc.replyRate}%
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {loc.avgWeeklyImpressions.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  {loc.avgWeeklyActions.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-muted text-muted-foreground">
                    {loc.primaryCategory}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
