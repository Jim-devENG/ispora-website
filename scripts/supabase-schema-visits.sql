-- iSpora Website Visits Tracking Table Schema
-- Run this in Supabase SQL Editor

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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_country ON visits(country);
CREATE INDEX IF NOT EXISTS idx_visits_page ON visits(page);
CREATE INDEX IF NOT EXISTS idx_visits_ip_address ON visits(ip_address);

-- Enable Row Level Security (RLS)
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Drop policy if it exists, then create it
DROP POLICY IF EXISTS "Allow public inserts" ON visits;
CREATE POLICY "Allow public inserts" ON visits
  FOR INSERT
  WITH CHECK (true);

-- Note: Service role key bypasses RLS, so admin operations will work
-- without additional policies. The service_role key is used in API routes.

