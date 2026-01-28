import { db } from "./index";
import { locations, reviews, kpis } from "./schema";
import { eq, sql, desc, asc, and, lte, count } from "drizzle-orm";

// --- Overview Stats ---
export async function getOverviewStats() {
  const kpiTotals = await db
    .select({
      totalImpressionsMaps: sql<number>`coalesce(sum(${kpis.impressionsMaps}), 0)`,
      totalImpressionsSearch: sql<number>`coalesce(sum(${kpis.impressionsSearch}), 0)`,
      totalPhoneCalls: sql<number>`coalesce(sum(${kpis.phoneCalls}), 0)`,
      totalDirectionRequests: sql<number>`coalesce(sum(${kpis.directionRequests}), 0)`,
      totalWebsiteClicks: sql<number>`coalesce(sum(${kpis.websiteClicks}), 0)`,
      totalBookings: sql<number>`coalesce(sum(${kpis.bookings}), 0)`,
    })
    .from(kpis);

  const ratingStats = await db
    .select({
      avgRating: sql<number>`coalesce(avg(${locations.averageRating}), 0)`,
      totalLocations: sql<number>`count(*)`,
    })
    .from(locations);

  const reviewStats = await db
    .select({
      totalReviews: sql<number>`count(*)`,
      repliedReviews: sql<number>`sum(case when ${reviews.hasReply} = true then 1 else 0 end)`,
    })
    .from(reviews);

  // Week-over-week trends: compare last 2 weeks
  const lastTwoWeeks = await db
    .select({
      weekStart: kpis.weekStart,
      impressions: sql<number>`sum(${kpis.impressionsMaps}) + sum(${kpis.impressionsSearch})`,
      actions: sql<number>`sum(${kpis.phoneCalls}) + sum(${kpis.directionRequests}) + sum(${kpis.websiteClicks})`,
    })
    .from(kpis)
    .groupBy(kpis.weekStart)
    .orderBy(desc(kpis.weekStart))
    .limit(2);

  let impressionsTrend = 0;
  let actionsTrend = 0;
  if (lastTwoWeeks.length === 2) {
    const current = lastTwoWeeks[0];
    const previous = lastTwoWeeks[1];
    if (previous.impressions > 0) {
      impressionsTrend =
        ((current.impressions - previous.impressions) / previous.impressions) *
        100;
    }
    if (previous.actions > 0) {
      actionsTrend =
        ((current.actions - previous.actions) / previous.actions) * 100;
    }
  }

  const k = kpiTotals[0];
  const r = ratingStats[0];
  const rv = reviewStats[0];

  return {
    totalImpressions:
      Number(k.totalImpressionsMaps) + Number(k.totalImpressionsSearch),
    totalActions:
      Number(k.totalPhoneCalls) +
      Number(k.totalDirectionRequests) +
      Number(k.totalWebsiteClicks),
    avgRating: Number(Number(r.avgRating).toFixed(1)),
    replyRate:
      rv.totalReviews > 0
        ? Math.round(
            (Number(rv.repliedReviews) / Number(rv.totalReviews)) * 100
          )
        : 0,
    totalLocations: Number(r.totalLocations),
    totalBookings: Number(k.totalBookings),
    impressionsTrend: Math.round(impressionsTrend * 10) / 10,
    actionsTrend: Math.round(actionsTrend * 10) / 10,
  };
}

// --- Locations List ---
export async function getLocationsList() {
  const locs = await db
    .select({
      locationId: locations.locationId,
      storeCode: locations.storeCode,
      name: locations.name,
      city: locations.city,
      state: locations.state,
      primaryCategory: locations.primaryCategory,
      averageRating: locations.averageRating,
      totalReviews: locations.totalReviews,
      isVerified: locations.isVerified,
      phone: locations.phone,
      address: locations.address,
    })
    .from(locations)
    .orderBy(asc(locations.name));

  // Get per-location KPI averages and reply rates
  const kpiAvgs = await db
    .select({
      locationId: kpis.locationId,
      avgImpressions: sql<number>`avg(${kpis.impressionsMaps} + ${kpis.impressionsSearch})`,
      avgActions: sql<number>`avg(${kpis.phoneCalls} + ${kpis.directionRequests} + ${kpis.websiteClicks})`,
    })
    .from(kpis)
    .groupBy(kpis.locationId);

  const replyRates = await db
    .select({
      locationId: reviews.locationId,
      total: sql<number>`count(*)`,
      replied: sql<number>`sum(case when ${reviews.hasReply} = true then 1 else 0 end)`,
    })
    .from(reviews)
    .groupBy(reviews.locationId);

  const kpiMap = new Map(kpiAvgs.map((k) => [k.locationId, k]));
  const replyMap = new Map(replyRates.map((r) => [r.locationId, r]));

  return locs.map((loc) => {
    const kpi = kpiMap.get(loc.locationId);
    const reply = replyMap.get(loc.locationId);
    return {
      ...loc,
      avgWeeklyImpressions: kpi ? Math.round(Number(kpi.avgImpressions)) : 0,
      avgWeeklyActions: kpi ? Math.round(Number(kpi.avgActions)) : 0,
      replyRate:
        reply && Number(reply.total) > 0
          ? Math.round((Number(reply.replied) / Number(reply.total)) * 100)
          : 0,
    };
  });
}

// --- Top and Bottom Locations ---
export async function getTopAndBottomLocations() {
  const allLocs = await db
    .select({
      locationId: locations.locationId,
      name: locations.name,
      city: locations.city,
      averageRating: locations.averageRating,
      totalReviews: locations.totalReviews,
    })
    .from(locations);

  const byRating = [...allLocs].sort(
    (a, b) => b.averageRating - a.averageRating
  );
  const byReviews = [...allLocs].sort(
    (a, b) => b.totalReviews - a.totalReviews
  );

  return {
    topByRating: byRating.slice(0, 10),
    bottomByRating: byRating.slice(-10).reverse(),
    topByReviews: byReviews.slice(0, 10),
  };
}

// --- Weekly KPI Trends ---
export async function getKpiTrends() {
  const trends = await db
    .select({
      weekStart: kpis.weekStart,
      totalImpressionsMaps: sql<number>`sum(${kpis.impressionsMaps})`,
      totalImpressionsSearch: sql<number>`sum(${kpis.impressionsSearch})`,
      totalPhoneCalls: sql<number>`sum(${kpis.phoneCalls})`,
      totalDirectionRequests: sql<number>`sum(${kpis.directionRequests})`,
      totalWebsiteClicks: sql<number>`sum(${kpis.websiteClicks})`,
      totalBookings: sql<number>`sum(${kpis.bookings})`,
    })
    .from(kpis)
    .groupBy(kpis.weekStart)
    .orderBy(asc(kpis.weekStart));

  return trends.map((t) => ({
    weekStart: t.weekStart,
    impressions:
      Number(t.totalImpressionsMaps) + Number(t.totalImpressionsSearch),
    mapImpressions: Number(t.totalImpressionsMaps),
    searchImpressions: Number(t.totalImpressionsSearch),
    phoneCalls: Number(t.totalPhoneCalls),
    directionRequests: Number(t.totalDirectionRequests),
    websiteClicks: Number(t.totalWebsiteClicks),
    actions:
      Number(t.totalPhoneCalls) +
      Number(t.totalDirectionRequests) +
      Number(t.totalWebsiteClicks),
    bookings: Number(t.totalBookings),
  }));
}

// --- City Performance ---
export async function getCityPerformance() {
  const cityStats = await db
    .select({
      city: locations.city,
      avgRating: sql<number>`avg(${locations.averageRating})`,
      totalReviews: sql<number>`sum(${locations.totalReviews})`,
      locationCount: sql<number>`count(*)`,
    })
    .from(locations)
    .groupBy(locations.city)
    .orderBy(desc(sql`sum(${locations.totalReviews})`));

  // Get KPI data per city by joining
  const cityKpis = await db
    .select({
      city: locations.city,
      totalImpressions: sql<number>`sum(${kpis.impressionsMaps}) + sum(${kpis.impressionsSearch})`,
      totalActions: sql<number>`sum(${kpis.phoneCalls}) + sum(${kpis.directionRequests}) + sum(${kpis.websiteClicks})`,
    })
    .from(kpis)
    .innerJoin(locations, eq(kpis.locationId, locations.locationId))
    .groupBy(locations.city);

  const kpiMap = new Map(cityKpis.map((c) => [c.city, c]));

  return cityStats.map((c) => {
    const kpi = kpiMap.get(c.city);
    return {
      city: c.city,
      avgRating: Number(Number(c.avgRating).toFixed(1)),
      totalReviews: Number(c.totalReviews),
      locationCount: Number(c.locationCount),
      totalImpressions: kpi ? Number(kpi.totalImpressions) : 0,
      totalActions: kpi ? Number(kpi.totalActions) : 0,
    };
  });
}

// --- Category Performance ---
export async function getCategoryPerformance() {
  const catStats = await db
    .select({
      category: locations.primaryCategory,
      avgRating: sql<number>`avg(${locations.averageRating})`,
      totalReviews: sql<number>`sum(${locations.totalReviews})`,
      locationCount: sql<number>`count(*)`,
    })
    .from(locations)
    .groupBy(locations.primaryCategory)
    .orderBy(desc(sql`avg(${locations.averageRating})`));

  const catKpis = await db
    .select({
      category: locations.primaryCategory,
      totalImpressions: sql<number>`sum(${kpis.impressionsMaps}) + sum(${kpis.impressionsSearch})`,
      totalActions: sql<number>`sum(${kpis.phoneCalls}) + sum(${kpis.directionRequests}) + sum(${kpis.websiteClicks})`,
    })
    .from(kpis)
    .innerJoin(locations, eq(kpis.locationId, locations.locationId))
    .groupBy(locations.primaryCategory);

  const kpiMap = new Map(catKpis.map((c) => [c.category, c]));

  return catStats.map((c) => {
    const kpi = kpiMap.get(c.category);
    return {
      category: c.category,
      avgRating: Number(Number(c.avgRating).toFixed(1)),
      totalReviews: Number(c.totalReviews),
      locationCount: Number(c.locationCount),
      totalImpressions: kpi ? Number(kpi.totalImpressions) : 0,
      totalActions: kpi ? Number(kpi.totalActions) : 0,
    };
  });
}

// --- Review Insights ---
export async function getReviewInsights() {
  const ratingDist = await db
    .select({
      rating: reviews.rating,
      count: sql<number>`count(*)`,
    })
    .from(reviews)
    .groupBy(reviews.rating)
    .orderBy(asc(reviews.rating));

  const replyStats = await db
    .select({
      total: sql<number>`count(*)`,
      replied: sql<number>`sum(case when ${reviews.hasReply} = true then 1 else 0 end)`,
    })
    .from(reviews);

  const langBreakdown = await db
    .select({
      language: reviews.language,
      count: sql<number>`count(*)`,
    })
    .from(reviews)
    .groupBy(reviews.language)
    .orderBy(desc(sql`count(*)`));

  const recentNegative = await db
    .select({
      reviewId: reviews.reviewId,
      locationId: reviews.locationId,
      rating: reviews.rating,
      reviewText: reviews.reviewText,
      reviewerName: reviews.reviewerName,
      reviewDate: reviews.reviewDate,
      hasReply: reviews.hasReply,
      locationName: locations.name,
      city: locations.city,
    })
    .from(reviews)
    .innerJoin(locations, eq(reviews.locationId, locations.locationId))
    .where(lte(reviews.rating, sql`2`))
    .orderBy(desc(reviews.reviewDate))
    .limit(20);

  return {
    ratingDistribution: ratingDist.map((r) => ({
      rating: r.rating,
      count: Number(r.count),
    })),
    replyRate: {
      total: Number(replyStats[0].total),
      replied: Number(replyStats[0].replied),
      rate:
        replyStats[0].total > 0
          ? Math.round(
              (Number(replyStats[0].replied) / Number(replyStats[0].total)) *
                100
            )
          : 0,
    },
    languageBreakdown: langBreakdown.map((l) => ({
      language: l.language,
      count: Number(l.count),
    })),
    recentNegativeReviews: recentNegative,
  };
}

// --- Location Detail ---
export async function getLocationDetail(id: string) {
  const loc = await db
    .select()
    .from(locations)
    .where(eq(locations.locationId, id))
    .limit(1);

  if (!loc.length) return null;

  const locationReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.locationId, id))
    .orderBy(desc(reviews.reviewDate));

  const locationKpis = await db
    .select()
    .from(kpis)
    .where(eq(kpis.locationId, id))
    .orderBy(asc(kpis.weekStart));

  // Network averages for comparison
  const networkAvg = await db
    .select({
      avgRating: sql<number>`avg(${locations.averageRating})`,
      avgImpressions: sql<number>`avg(sub.imp)`,
      avgActions: sql<number>`avg(sub.act)`,
    })
    .from(
      sql`(select ${kpis.locationId}, avg(${kpis.impressionsMaps} + ${kpis.impressionsSearch}) as imp, avg(${kpis.phoneCalls} + ${kpis.directionRequests} + ${kpis.websiteClicks}) as act from ${kpis} group by ${kpis.locationId}) as sub`
    )
    .innerJoin(locations, eq(locations.locationId, sql`sub.location_id`));

  return {
    location: loc[0],
    reviews: locationReviews,
    kpiHistory: locationKpis.map((k) => ({
      weekStart: k.weekStart,
      impressions: k.impressionsMaps + k.impressionsSearch,
      mapImpressions: k.impressionsMaps,
      searchImpressions: k.impressionsSearch,
      phoneCalls: k.phoneCalls,
      directionRequests: k.directionRequests,
      websiteClicks: k.websiteClicks,
      actions: k.phoneCalls + k.directionRequests + k.websiteClicks,
      bookings: k.bookings,
    })),
    networkAvg: networkAvg.length
      ? {
          avgRating: Number(Number(networkAvg[0].avgRating).toFixed(1)),
          avgImpressions: Math.round(Number(networkAvg[0].avgImpressions)),
          avgActions: Math.round(Number(networkAvg[0].avgActions)),
        }
      : null,
  };
}

// --- Alerts ---
export async function getAlerts() {
  // Low-rated stores
  const lowRated = await db
    .select({
      locationId: locations.locationId,
      name: locations.name,
      city: locations.city,
      averageRating: locations.averageRating,
    })
    .from(locations)
    .where(sql`${locations.averageRating} < 3.5`)
    .orderBy(asc(locations.averageRating));

  // Unreplied negative reviews
  const unrepliedNegative = await db
    .select({
      reviewId: reviews.reviewId,
      locationId: reviews.locationId,
      rating: reviews.rating,
      reviewText: reviews.reviewText,
      reviewerName: reviews.reviewerName,
      reviewDate: reviews.reviewDate,
      locationName: locations.name,
      city: locations.city,
    })
    .from(reviews)
    .innerJoin(locations, eq(reviews.locationId, locations.locationId))
    .where(and(lte(reviews.rating, sql`2`), eq(reviews.hasReply, false)))
    .orderBy(desc(reviews.reviewDate))
    .limit(10);

  // Locations with declining engagement (compare last 2 weeks)
  const weeklyByLocation = await db
    .select({
      locationId: kpis.locationId,
      weekStart: kpis.weekStart,
      impressions: sql<number>`${kpis.impressionsMaps} + ${kpis.impressionsSearch}`,
    })
    .from(kpis)
    .orderBy(desc(kpis.weekStart));

  // Group by location and get last 2 weeks
  const byLoc = new Map<string, { weekStart: string; impressions: number }[]>();
  for (const row of weeklyByLocation) {
    const arr = byLoc.get(row.locationId) || [];
    arr.push({
      weekStart: row.weekStart,
      impressions: Number(row.impressions),
    });
    byLoc.set(row.locationId, arr);
  }

  const declining: {
    locationId: string;
    name: string;
    city: string;
    decline: number;
  }[] = [];
  const locMap = new Map(
    (
      await db
        .select({
          locationId: locations.locationId,
          name: locations.name,
          city: locations.city,
        })
        .from(locations)
    ).map((l) => [l.locationId, l])
  );

  for (const [locId, weeks] of byLoc) {
    if (weeks.length >= 2) {
      const current = weeks[0].impressions;
      const previous = weeks[1].impressions;
      if (previous > 0) {
        const change = ((current - previous) / previous) * 100;
        if (change < -15) {
          const loc = locMap.get(locId);
          if (loc) {
            declining.push({
              locationId: locId,
              name: loc.name,
              city: loc.city,
              decline: Math.round(change),
            });
          }
        }
      }
    }
  }

  declining.sort((a, b) => a.decline - b.decline);

  return {
    lowRatedStores: lowRated,
    unrepliedNegativeReviews: unrepliedNegative,
    decliningEngagement: declining.slice(0, 10),
  };
}

// --- Get total count of locations ---
export async function getTotalLocations() {
  const result = await db
    .select({
      count: count(locations.locationId),
    })
    .from(locations);

  return {
    locationCount: result[0].count,
  };
}
