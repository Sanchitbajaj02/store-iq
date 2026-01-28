# Store IQ

A Location Intelligence Platform that transforms raw multi-location business data into actionable executive insights. Built with Next.js 16 and Supabase.

**Live Demo:** [Deployed URL](https://store-iq.example.com)

**Test Credentials:**  
- Email: `test@example.com`
- Password: `password123`

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Architecture Overview](#architecture-overview)
- [Key Decisions & Tradeoffs](#key-decisions--tradeoffs)
- [What Did I Build and Why?](#what-did-i-build-and-why)
- [Patterns & Insights Discovered](#patterns--insights-discovered)
- [What Would I Build Next?](#what-would-i-build-next)

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/Sanchitbajaj02/store-iq.git
cd store-iq
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_supabase_postgresql_connection_string
```

You can find these values in your Supabase project dashboard under **Settings > API**.

### 4. Run Database Migrations

```bash
npm run db:migrate
```

This creates the `locations`, `reviews`, and `kpis` tables with proper indexes and relationships.

### 5. Seed the Database

```bash
npm run db:seed
```

This imports all CSV data (50 locations, 200 reviews, 500 KPI records) into your database.

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 7. Build for Production

```bash
npm run build
npm start
```

---

## Architecture Overview

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 4, shadcn/ui (Radix UI primitives) |
| **Charts** | Recharts 3.7 |
| **State** | Zustand 5, React Server Components |
| **Database** | Supabase (PostgreSQL) |
| **ORM** | Drizzle ORM with type-safe queries |
| **Auth** | Supabase Auth (cookie-based sessions) |

### Project Structure

```
store-iq/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Main dashboard pages
│   │   │   ├── page.tsx        # Overview with KPIs & alerts
│   │   │   ├── locations/      # Location catalog & detail
│   │   │   ├── reviews/        # Review analytics
│   │   │   └── performance/    # Performance rankings
│   │   └── (auth)/             # Authentication routes
│   │
│   ├── components/
│   │   ├── dashboard/          # Dashboard-specific components
│   │   │   ├── overview-stats.tsx
│   │   │   ├── alerts-panel.tsx
│   │   │   ├── kpi-trend-chart.tsx
│   │   │   └── ...
│   │   └── ui/                 # shadcn/ui component library
│   │
│   └── lib/
│       ├── db/
│       │   ├── schema.ts       # Database schema (Drizzle)
│       │   ├── queries.ts      # Business intelligence queries
│       │   └── seed.ts         # CSV data ingestion
│       └── supabase/           # Supabase client setup
│
├── data/                       # CSV seed files
│   ├── locations.csv           # 50 retail stores
│   ├── reviews.csv             # 200 customer reviews
│   └── kpis.csv                # 500 weekly KPI records
│
└── drizzle/                    # Database migrations
```

---

## Key Decisions & Tradeoffs

### 1. Drizzle ORM over Raw SQL

**Decision:** Used Drizzle ORM for database operations.

**Why:** Full TypeScript type safety from schema to query results, eliminating runtime type mismatches. The compile-time query validation catches errors early and provides excellent autocompletion.

**Tradeoff:** Slight learning curve and additional dependency, but the type safety benefits outweigh the cost for a data-intensive application.

### 2. Server Components First

**Decision:** Leveraged React Server Components for data fetching wherever possible.

**Why:** Data is fetched on the server, reducing client-side JavaScript and improving initial load performance. Dashboard queries run directly against the database without API round-trips.

**Tradeoff:** Interactive features require careful "use client" boundaries, but the platform is primarily read-heavy, making this a good fit.

### 3. Computed Metrics over Stored Aggregations

**Decision:** Calculate metrics like week-over-week trends, reply rates, and averages at query time rather than storing pre-computed values.

**Why:** Ensures data freshness without sync complexity. PostgreSQL handles these aggregations efficiently with proper indexes.

**Tradeoff:** Slightly higher query cost, but avoids stale data issues and simplifies the data model.

### 4. Alert-Based Intelligence

**Decision:** Built an alert system that proactively surfaces issues (low ratings, declining engagement, unreplied reviews) rather than just displaying dashboards.

**Why:** Executives don't have time to scan 50 stores looking for problems. The platform should tell them what needs attention.

**Tradeoff:** Required defining business logic thresholds (e.g., <3.5 rating = low, >15% drop = declining), which may need tuning per business.

### 5. shadcn/ui Component Library

**Decision:** Used shadcn/ui (Radix UI primitives) instead of a heavier component library.

**Why:** Copy-paste components that are fully customizable, no runtime bloat, and consistent with the Tailwind approach.

**Tradeoff:** More initial setup than an all-in-one library, but provides maximum flexibility.

---

## What Did I Build and Why?

### The Problem

Raw data from 50 retail stores across India (locations, reviews, and weekly KPIs) needed to be transformed into a platform that helps senior leadership make decisions quickly. The goal was **not** to build simple data tables or generic dashboards that just visualize numbers.

### The Solution

**Store IQ** is an intelligence layer that answers business questions:

1. **Executive Dashboard** - A CXO can understand network health in under 3 minutes with:
   - Four key metrics (Impressions, Actions, Avg Rating, Reply Rate) with week-over-week trends
   - Alerts panel showing locations that need immediate attention
   - City and category performance breakdowns

2. **Proactive Alerts** - The platform actively identifies:
   - **Low-rated stores** (avg rating < 3.5) that may be hurting brand perception
   - **Declining engagement** (>15% week-over-week drop) indicating potential issues
   - **Unreplied negative reviews** (1-2 stars without response) creating customer experience gaps

3. **Location Intelligence** - Deep-dive into any location with:
   - Performance vs network averages (is this store above or below benchmark?)
   - Historical KPI trends
   - Complete review history with response tracking

4. **Review Analytics** - Understanding customer sentiment:
   - Rating distribution across the network
   - Reply rate tracking (accountability metric)
   - Language breakdown (English/Hindi) for regional insights
   - Recent negative reviews requiring immediate action

5. **Performance Rankings** - Comparative analysis:
   - Top and bottom 10 stores by rating
   - Stores by review volume (customer engagement indicator)
   - Conversion funnel (Impressions > Actions > Bookings)

### Why This Approach?

The platform is designed for **decision-making, not data browsing**. Every view answers a specific question:
- "What needs my attention right now?" > Alerts Panel
- "How is the network performing?" > Overview Stats
- "Which cities/categories are struggling?" > Performance Breakdowns
- "Is this store doing well?" > Location Detail with network comparison

---

## Patterns & Insights Discovered

While building the platform and analyzing the data, several interesting patterns emerged:

### 1. Reply Rate Correlation with Ratings

Stores with higher reply rates tend to have better average ratings. This suggests that responding to reviews (especially negative ones) positively impacts customer perception and encourages more positive reviews.

### 2. Geographic Performance Variance

Performance varies significantly by city. Some cities consistently outperform others in terms of impressions and customer actions, which could indicate:
- Different market maturity levels
- Varying local competition
- Marketing effectiveness differences

### 3. Engagement-to-Action Conversion

The ratio of impressions to customer actions (calls, directions, clicks) varies across stores. High-impression, low-action stores may have profile optimization issues (poor photos, incomplete information, or weak call-to-action).

### 4. Negative Review Response Gap

A notable portion of 1-2 star reviews remain unanswered. These represent missed opportunities to recover unhappy customers and demonstrate responsiveness to future customers reading reviews.

### 5. Weekly Performance Cycles

KPI data shows patterns in weekly performance, with certain weeks consistently showing higher or lower engagement across the network, likely correlating with seasonal factors or promotional periods.

---

## What Would I Build Next?

With more time, I would extend the platform with:

### 1. AI-Powered Review Analysis

- **Sentiment analysis** on review text to detect specific issues (wait times, staff behavior, cleanliness)
- **Topic extraction** to identify recurring themes across locations
- **Auto-generated response suggestions** for common complaint types

### 2. Predictive Analytics

- **Churn prediction** - Identify stores likely to see declining engagement before it happens
- **Rating trajectory forecasting** - Project where a store's rating is heading based on recent review trends
- **Anomaly detection** - Automatically flag unusual spikes or drops in metrics

### 3. Competitive Intelligence

- **Competitor tracking** - Monitor nearby competitor ratings and reviews
- **Market share indicators** - Compare local search visibility against competitors
- **Benchmarking** - How does each store rank against local competitors, not just network averages

### 4. Action Management

- **Task assignment** - Assign "respond to this review" or "investigate this alert" to team members
- **Follow-up tracking** - Did the action taken improve the metric?
- **Escalation workflows** - Auto-escalate unresolved issues to area managers

---

## License

This project was built as part of a technical assignment.