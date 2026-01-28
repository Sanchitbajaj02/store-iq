import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  text,
  integer,
  real,
  boolean,
  date,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull(),
  name: varchar("name", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).unique().notNull(),
  password: varchar("password", { length: 64 }).notNull(),
  createdAt: timestamp().defaultNow(),
});

export const locations = pgTable("locations", {
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
});

export const reviews = pgTable("reviews", {
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
});

export const kpis = pgTable("kpis", {
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
});
