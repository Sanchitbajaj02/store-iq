# Location Intelligence Platform - Assignment Data

## Quick Start

1. Read `ASSIGNMENT.md` for the full task description
2. Use the 3 CSV files in the `data/` folder
3. Build your solution
4. Submit via GitHub + deployed URL

## Data Files

| File | Rows | Description |
|------|------|-------------|
| `data/locations.csv` | 50 | Store information for a healthcare brand |
| `data/reviews.csv` | 200 | Customer reviews from Google Business Profile |
| `data/kpis.csv` | 500 | Weekly performance metrics (10 weeks × 50 locations) |

## Data Relationships

```
locations (50)
    ↓
    ├── reviews (200) - Multiple reviews per location
    │   └── Linked via: location_id
    │
    └── kpis (500) - 10 weeks of metrics per location
        └── Linked via: location_id
```

## Schema Reference

### locations.csv
| Column | Type | Description |
|--------|------|-------------|
| location_id | UUID | Primary key |
| store_code | String | Business identifier (e.g., "MUM-001") |
| name | String | Store name |
| address | String | Street address |
| city | String | City name |
| state | String | State name |
| pincode | String | Postal code |
| latitude | Float | GPS latitude |
| longitude | Float | GPS longitude |
| primary_category | String | Business category |
| phone | String | Phone number |
| website | String | Store webpage URL |
| average_rating | Float | Current Google rating (1-5) |
| total_reviews | Integer | Total review count |
| is_verified | Boolean | Google verification status |

### reviews.csv
| Column | Type | Description |
|--------|------|-------------|
| review_id | UUID | Primary key |
| location_id | UUID | Foreign key to locations |
| rating | Integer | Star rating (1-5) |
| review_text | String | Customer feedback text |
| reviewer_name | String | Reviewer display name |
| review_date | Date | When review was posted (YYYY-MM-DD) |
| language | String | Review language (en/hi) |
| has_reply | Boolean | Whether business responded |
| reply_text | String | Business response (if any) |

### kpis.csv
| Column | Type | Description |
|--------|------|-------------|
| kpi_id | UUID | Primary key |
| location_id | UUID | Foreign key to locations |
| week_start | Date | Start of the week (Monday, YYYY-MM-DD) |
| impressions_maps | Integer | Views on Google Maps |
| impressions_search | Integer | Views in Google Search |
| phone_calls | Integer | Call button clicks |
| direction_requests | Integer | Direction requests |
| website_clicks | Integer | Website link clicks |
| bookings | Integer | Booking/appointment actions |

## Data Characteristics

### Locations
- **14 cities** across India
- **7 business categories** (Medical Clinic, Diagnostic Center, etc.)
- Ratings range from **2.6 to 5.0**
- Mix of high-performing and struggling locations

### Reviews
- **Date range:** June 2024 - January 2025
- **Languages:** Primarily English, ~15% Hindi
- **Rating distribution:** Mix of positive (4-5★), neutral (3★), and negative (1-2★)
- Contains specific feedback themes (wait time, billing, cleanliness, staff behavior)

### KPIs
- **10 consecutive weeks** of data per location
- Some locations show **growth trends**, others show **decline**
- Metrics are correlated (higher impressions generally = higher calls)

## What to Build

See `ASSIGNMENT.md` for full requirements. Key points:

1. **Don't just visualize data** - Extract insights
2. **Think like a business leader** - What decisions can they make from your platform?
3. **Quality over quantity** - 3 excellent features > 10 mediocre ones

## Questions?

Make reasonable assumptions and document them in your README.

---

Good luck! 🚀
