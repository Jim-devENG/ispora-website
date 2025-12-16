# Events API 500 Error Debugging

## Issue
When creating an event in the admin dashboard, the API returns a 500 error.

## Possible Causes

### 1. RLS Policies Not Applied
The `events` table needs RLS policies to allow service role access.

**Fix**: Run this SQL in Supabase SQL Editor:

```sql
-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
DROP POLICY IF EXISTS "Allow service role full access" ON events;
CREATE POLICY "Allow service role full access" ON events
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### 2. Missing Required Fields
The `events` table requires:
- `title` (TEXT NOT NULL)
- `start_at` (TIMESTAMPTZ NOT NULL)
- `status` (TEXT NOT NULL, must be 'draft', 'published', or 'archived')

**Check**: Verify the payload includes all required fields.

### 3. Invalid Status Value
Status must be exactly one of: 'draft', 'published', 'archived'

**Check**: Ensure the status value matches exactly (case-sensitive).

### 4. Date Format Issues
Dates must be valid ISO strings.

**Check**: Verify `start_at` and `end_at` are valid dates.

## How to Debug

1. **Check Vercel Logs**:
   - Go to Vercel Dashboard → Your Project → Logs
   - Look for `[API][EVENTS]` error messages
   - The improved logging will show:
     - Error code
     - Error message
     - Error details
     - Error hint

2. **Check Database**:
   - Go to Supabase Dashboard → Table Editor → `events`
   - Verify the table structure matches the schema
   - Check if RLS is enabled and policies exist

3. **Test Directly**:
   - Try creating an event via Supabase SQL Editor:
   ```sql
   INSERT INTO events (title, start_at, status)
   VALUES ('Test Event', NOW(), 'draft')
   RETURNING *;
   ```

## Expected Behavior

After fixing, creating an event should:
1. Return 201 status
2. Return `{ event: Event }` JSON
3. Show the new event in the admin dashboard

## Next Steps

1. Check Vercel logs for detailed error message
2. Verify RLS policies are applied
3. Test with a simple event (just title and start_at)
4. Check if the error persists after deployment

