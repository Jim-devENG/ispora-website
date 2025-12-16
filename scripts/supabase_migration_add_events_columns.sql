-- Migration: Add missing columns to events table
-- This fixes the error: "Could not find the 'location' column of 'events'"

-- Add location column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'location'
  ) THEN
    ALTER TABLE events ADD COLUMN location TEXT;
    RAISE NOTICE 'Added location column to events table';
  END IF;
END $$;

-- Add registration_link column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'registration_link'
  ) THEN
    ALTER TABLE events ADD COLUMN registration_link TEXT;
    RAISE NOTICE 'Added registration_link column to events table';
  END IF;
END $$;

-- Add cover_image_url column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'cover_image_url'
  ) THEN
    ALTER TABLE events ADD COLUMN cover_image_url TEXT;
    RAISE NOTICE 'Added cover_image_url column to events table';
  END IF;
END $$;

-- Verify all columns exist
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'events'
ORDER BY ordinal_position;

