CREATE TABLE "kpis" (
	"kpi_id" uuid PRIMARY KEY NOT NULL,
	"location_id" uuid NOT NULL,
	"week_start" date NOT NULL,
	"impressions_maps" integer DEFAULT 0 NOT NULL,
	"impressions_search" integer DEFAULT 0 NOT NULL,
	"phone_calls" integer DEFAULT 0 NOT NULL,
	"direction_requests" integer DEFAULT 0 NOT NULL,
	"website_clicks" integer DEFAULT 0 NOT NULL,
	"bookings" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"location_id" uuid PRIMARY KEY NOT NULL,
	"store_code" varchar(20) NOT NULL,
	"name" varchar(200) NOT NULL,
	"address" text NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"pincode" varchar(10) NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"primary_category" varchar(100) NOT NULL,
	"phone" varchar(20),
	"website" varchar(300),
	"average_rating" real NOT NULL,
	"total_reviews" integer NOT NULL,
	"is_verified" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"review_id" uuid PRIMARY KEY NOT NULL,
	"location_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"review_text" text,
	"reviewer_name" varchar(100) NOT NULL,
	"review_date" date NOT NULL,
	"language" varchar(10) DEFAULT 'en' NOT NULL,
	"has_reply" boolean DEFAULT false NOT NULL,
	"reply_text" text
);
--> statement-breakpoint
ALTER TABLE "kpis" ADD CONSTRAINT "kpis_location_id_locations_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("location_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_location_id_locations_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("location_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "kpis_location_id_idx" ON "kpis" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "kpis_week_start_idx" ON "kpis" USING btree ("week_start");--> statement-breakpoint
CREATE INDEX "kpis_location_week_idx" ON "kpis" USING btree ("location_id","week_start");--> statement-breakpoint
CREATE INDEX "locations_store_code_idx" ON "locations" USING btree ("store_code");--> statement-breakpoint
CREATE INDEX "locations_city_idx" ON "locations" USING btree ("city");--> statement-breakpoint
CREATE INDEX "locations_state_idx" ON "locations" USING btree ("state");--> statement-breakpoint
CREATE INDEX "locations_primary_category_idx" ON "locations" USING btree ("primary_category");--> statement-breakpoint
CREATE INDEX "reviews_location_id_idx" ON "reviews" USING btree ("location_id");--> statement-breakpoint
CREATE INDEX "reviews_review_date_idx" ON "reviews" USING btree ("review_date");--> statement-breakpoint
CREATE INDEX "reviews_location_date_idx" ON "reviews" USING btree ("location_id","review_date");