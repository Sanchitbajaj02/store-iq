import fs from "fs";
import path from "path";
import { locations, reviews, kpis } from "./schema";
import { db, client } from "./index";

function parseCsv(filePath: string): Record<string, string>[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.trim().split("\n");
  const headers = parseCsvLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] || "";
    });
    rows.push(row);
  }
  return rows;
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

async function seed() {
  console.log("Seeding database...");

  const dataDir = path.resolve(process.cwd(), "data");

  // Seed locations
  console.log("Seeding locations...");
  const locationRows = parseCsv(path.join(dataDir, "locations.csv"));
  const locationValues = locationRows.map((row) => ({
    locationId: row.location_id,
    storeCode: row.store_code,
    name: row.name,
    address: row.address,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    latitude: parseFloat(row.latitude),
    longitude: parseFloat(row.longitude),
    primaryCategory: row.primary_category,
    phone: row.phone || null,
    website: row.website || null,
    averageRating: parseFloat(row.average_rating),
    totalReviews: parseInt(row.total_reviews, 10),
    isVerified: row.is_verified === "True",
  }));

  await db.delete(kpis);
  await db.delete(reviews);
  await db.delete(locations);

  for (const loc of locationValues) {
    await db.insert(locations).values(loc);
  }
  console.log(`Inserted ${locationValues.length} locations.`);

  // Seed reviews
  console.log("Seeding reviews...");
  const reviewRows = parseCsv(path.join(dataDir, "reviews.csv"));
  const reviewValues = reviewRows.map((row) => ({
    reviewId: row.review_id,
    locationId: row.location_id,
    rating: parseInt(row.rating, 10),
    reviewText: row.review_text || null,
    reviewerName: row.reviewer_name,
    reviewDate: row.review_date,
    language: row.language || "en",
    hasReply: row.has_reply === "True",
    replyText: row.reply_text || null,
  }));

  const reviewBatchSize = 50;
  for (let i = 0; i < reviewValues.length; i += reviewBatchSize) {
    const batch = reviewValues.slice(i, i + reviewBatchSize);
    await db.insert(reviews).values(batch);
  }
  console.log(`Inserted ${reviewValues.length} reviews.`);

  // Seed KPIs
  console.log("Seeding KPIs...");
  const kpiRows = parseCsv(path.join(dataDir, "kpis.csv"));
  const kpiValues = kpiRows.map((row) => ({
    kpiId: row.kpi_id,
    locationId: row.location_id,
    weekStart: row.week_start,
    impressionsMaps: parseInt(row.impressions_maps, 10),
    impressionsSearch: parseInt(row.impressions_search, 10),
    phoneCalls: parseInt(row.phone_calls, 10),
    directionRequests: parseInt(row.direction_requests, 10),
    websiteClicks: parseInt(row.website_clicks, 10),
    bookings: parseInt(row.bookings, 10),
  }));

  const kpiBatchSize = 50;
  for (let i = 0; i < kpiValues.length; i += kpiBatchSize) {
    const batch = kpiValues.slice(i, i + kpiBatchSize);
    await db.insert(kpis).values(batch);
  }
  console.log(`Inserted ${kpiValues.length} KPIs.`);

  console.log("Seeding complete!");
  await client.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
