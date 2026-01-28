import {
  pgTable,
  varchar,
  uuid,
  text,
  integer,
  real,
  boolean,
  date,
  index,
} from "drizzle-orm/pg-core";

export const locations = pgTable(
  "locations",
  {
    locationId: uuid("location_id").primaryKey().notNull(),
    storeCode: varchar("store_code", { length: 20 }).notNull(),
    name: varchar("name", { length: 200 }).notNull(),
    address: text("address").notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }).notNull(),
    pincode: varchar("pincode", { length: 10 }).notNull(),
    latitude: real("latitude").notNull(),
    longitude: real("longitude").notNull(),
    primaryCategory: varchar("primary_category", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    website: varchar("website", { length: 300 }),
    averageRating: real("average_rating").notNull(),
    totalReviews: integer("total_reviews").notNull(),
    isVerified: boolean("is_verified").notNull().default(true),
  },
  (table) => [
    index("locations_store_code_idx").on(table.storeCode),
    index("locations_city_idx").on(table.city),
    index("locations_state_idx").on(table.state),
    index("locations_primary_category_idx").on(table.primaryCategory),
  ]
);

export const reviews = pgTable(
  "reviews",
  {
    reviewId: uuid("review_id").primaryKey().notNull(),
    locationId: uuid("location_id")
      .notNull()
      .references(() => locations.locationId),
    rating: integer("rating").notNull(),
    reviewText: text("review_text"),
    reviewerName: varchar("reviewer_name", { length: 100 }).notNull(),
    reviewDate: date("review_date").notNull(),
    language: varchar("language", { length: 10 }).notNull().default("en"),
    hasReply: boolean("has_reply").notNull().default(false),
    replyText: text("reply_text"),
  },
  (table) => [
    index("reviews_location_id_idx").on(table.locationId),
    index("reviews_review_date_idx").on(table.reviewDate),
    index("reviews_location_date_idx").on(table.locationId, table.reviewDate),
  ]
);

export const kpis = pgTable(
  "kpis",
  {
    kpiId: uuid("kpi_id").primaryKey().notNull(),
    locationId: uuid("location_id")
      .notNull()
      .references(() => locations.locationId),
    weekStart: date("week_start").notNull(),
    impressionsMaps: integer("impressions_maps").notNull().default(0),
    impressionsSearch: integer("impressions_search").notNull().default(0),
    phoneCalls: integer("phone_calls").notNull().default(0),
    directionRequests: integer("direction_requests").notNull().default(0),
    websiteClicks: integer("website_clicks").notNull().default(0),
    bookings: integer("bookings").notNull().default(0),
  },
  (table) => [
    index("kpis_location_id_idx").on(table.locationId),
    index("kpis_week_start_idx").on(table.weekStart),
    index("kpis_location_week_idx").on(table.locationId, table.weekStart),
  ]
);
