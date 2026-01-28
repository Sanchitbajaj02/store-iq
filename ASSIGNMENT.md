# Full-Stack Developer Assignment
## Location Intelligence Platform

**Duration:** 4-5 days  
**Stack:** Next.js + Supabase (or any preferred stack)  

---

## Background

You are provided with sample data from a multi-location business with 50 retail stores across India. The data includes:

1. **Locations** - Store information (50 stores)
2. **Reviews** - Customer feedback from Google Business Profile (200 reviews)
3. **KPIs** - Weekly performance metrics synced from Google (500 records)

Your task is to build a **Location Intelligence Platform** that transforms this raw data into actionable business insights for senior leadership.

---

## The Challenge

### What We DON'T Want
- Simple data tables showing raw numbers
- Basic CRUD operations
- Generic dashboards that just visualize data as-is
- Charts without context or meaning

### What We DO Want
An **intelligence layer** that answers business questions like:

- "Which locations need immediate attention and why?"
- "What patterns exist in customer feedback that leadership should know about?"
- "How is performance trending, and what does it mean for the business?"
- "What actionable insights can we extract from this data?"

Think of it this way: A CXO has 3 minutes to understand what's happening across 50 locations. What do they need to see? What decisions should your platform help them make?

---

## Data Files Provided

### 1. `locations.csv` (50 rows)
Store information including:
- `location_id` - Unique identifier
- `store_code` - Business store code (e.g., "MUM-001")
- `name` - Store name
- `address`, `city`, `state`, `pincode`
- `latitude`, `longitude`
- `primary_category` - Business category
- `phone`, `website`
- `average_rating` - Current Google rating
- `total_reviews` - Total review count
- `is_verified` - Google verification status

### 2. `reviews.csv` (200 rows)
Customer reviews including:
- `review_id` - Unique identifier
- `location_id` - Links to location
- `rating` - 1-5 stars
- `review_text` - Customer feedback text
- `reviewer_name`
- `review_date`
- `language` - Review language (en/hi)
- `has_reply` - Whether business responded
- `reply_text` - Business response (if any)

### 3. `kpis.csv` (500 rows)
Weekly performance metrics:
- `kpi_id` - Unique identifier
- `location_id` - Links to location
- `week_start` - Start of the week (date)
- `impressions_maps` - Times shown on Google Maps
- `impressions_search` - Times shown in Google Search
- `phone_calls` - Call button clicks
- `direction_requests` - Direction requests
- `website_clicks` - Website link clicks
- `bookings` - Booking actions (if applicable)

---

## Requirements

### Core Requirements

1. **Data Ingestion**
   - Import all 3 CSV files into your database
   - Establish relationships between tables
   - Handle data validation

2. **Intelligence Platform**
   - Build features that surface insights, not just data
   - Design for busy executives who need to understand things quickly
   - The platform should help users make decisions, not just see numbers

3. **User Interface**
   - Clean, professional UI
   - Mobile-responsive is a plus
   - Fast and usable

### Technical Requirements

- Use Supabase for database (free tier is fine)
- Frontend framework of your choice (Next.js preferred)
- Deploy to a live URL (Vercel/Netlify/etc.)
- Code hosted on GitHub (public repo)

---

## Submission

1. **GitHub Repository**
   - Clean commit history
   - README with:
     - Setup instructions
     - Architecture overview
     - Key decisions/tradeoffs
   
2. **Live Demo URL**
   - Working deployment
   - Seeded with provided data

3. **Brief Write-up** (in README or separate doc)
   - What did you build and why?
   - What patterns or insights did you discover in the data?
   - What would you build next with more time?

---

## Questions?

If anything is unclear about the assignment, make reasonable assumptions and document them. This mirrors real-world product development where perfect specifications rarely exist.

---

**Good luck! We're excited to see what you build.**
