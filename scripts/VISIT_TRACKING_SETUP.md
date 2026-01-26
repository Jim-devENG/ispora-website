# Website Visit Tracking Setup

## Overview
Website visit tracking has been implemented to track all page visits with location data (IP address, country, city, region, timezone).

## Changes Made

### 1. Admin Password Updated
- ✅ Changed admin password to `IamanadmininiSpora(100%)` in:
  - `frontend/components/admin/AdminLogin.tsx`
  - `frontend/components/AdminAccess.tsx`

### 2. Visit Tracking API
- ✅ Created `api/visits.ts` - API endpoint for logging and retrieving visits
  - `POST /api/visits` - Log a visit
  - `GET /api/visits` - Get recent visits
  - `GET /api/visits?stats=true` - Get visit statistics

### 3. Database Schema
- ✅ Created `scripts/supabase-schema-visits.sql` - SQL schema for visits table

### 4. Frontend Tracking
- ✅ Created `frontend/utils/visitTracker.ts` - Visit tracking utility
- ✅ Integrated tracking into `frontend/App.tsx` to track all page visits

## Setup Instructions

### Step 1: Create Visits Table in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the SQL from `scripts/supabase-schema-visits.sql`:

```sql
-- Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT,
  page TEXT,
  referrer TEXT,
  user_agent TEXT,
  location JSONB,
  country TEXT,
  city TEXT,
  region TEXT,
  timezone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_country ON visits(country);
CREATE INDEX IF NOT EXISTS idx_visits_page ON visits(page);
CREATE INDEX IF NOT EXISTS idx_visits_ip_address ON visits(ip_address);

-- Enable RLS
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Allow public inserts
DROP POLICY IF EXISTS "Allow public inserts" ON visits;
CREATE POLICY "Allow public inserts" ON visits
  FOR INSERT
  WITH CHECK (true);
```

### Step 2: Deploy Changes

The code changes are ready. After deploying:
- Visit tracking will automatically start working
- All page visits will be logged with location data
- The API endpoint `/api/visits` will be available

## How It Works

1. **Page Visit Tracking**: When a user visits any page, the `trackPageVisit()` function is called
2. **Location Detection**: The system automatically:
   - Fetches the user's IP address from `api.ipify.org`
   - Gets location data (country, city, region, coordinates) from `ipapi.co`
   - Captures browser timezone
3. **Data Logging**: Visit data is sent to `/api/visits` endpoint (fire-and-forget, non-blocking)
4. **Storage**: All visit data is stored in the Supabase `visits` table

## Data Tracked

For each visit, the following data is captured:
- **IP Address**: User's IP address
- **Page**: The page/route visited
- **Referrer**: Where the user came from (if available)
- **User Agent**: Browser information
- **Location**: 
  - Country
  - City
  - Region/State
  - Timezone
  - Latitude/Longitude (if available)
- **Timestamp**: When the visit occurred

## API Endpoints

### POST /api/visits
Log a new visit.

**Request Body:**
```json
{
  "page": "home",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "123.456.789.0",
  "location": {
    "country": "United States",
    "city": "New York",
    "region": "New York",
    "timezone": "America/New_York",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "country": "United States",
  "city": "New York",
  "region": "New York",
  "timezone": "America/New_York"
}
```

### GET /api/visits
Get recent visits (default: 100 most recent).

**Query Parameters:**
- `limit`: Number of visits to return (default: 100)

### GET /api/visits?stats=true
Get visit statistics.

**Response:**
```json
{
  "total": 1234,
  "daily": 45,
  "weekly": 234,
  "monthly": 890,
  "topCountries": [
    { "country": "United States", "count": 456 },
    { "country": "Nigeria", "count": 234 }
  ],
  "topPages": [
    { "page": "home", "count": 567 },
    { "page": "about", "count": 234 }
  ]
}
```

## Privacy Considerations

- IP addresses are stored but can be anonymized if needed
- Location data is approximate (city/region level, not exact address)
- All tracking is done client-side with user's browser
- No cookies are used for tracking
- Data is stored securely in Supabase

## Admin Dashboard Integration

To view visit statistics in the admin dashboard, you can:
1. Add a new tab or section to display visit stats
2. Use the `/api/visits?stats=true` endpoint to get statistics
3. Display top countries, top pages, and visit trends

## Notes

- Visit tracking is non-blocking and won't affect page load performance
- Tracking failures are silently handled (won't break the app)
- Each page visit is tracked once per session (debounced to prevent duplicate tracking)
- The system uses free IP geolocation APIs (ipify.org and ipapi.co) which have rate limits

