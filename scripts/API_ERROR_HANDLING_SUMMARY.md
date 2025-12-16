# API Error Handling & Logging - Implementation Summary

## Overview

All admin API routes have been updated with:
1. **Strict environment variable validation** in Supabase client
2. **Consistent error handling** with standardized logging prefixes
3. **JSON-only error responses** (never HTML)
4. **Debug endpoint** for Supabase connection testing

## Changes Made

### 1. Supabase Client (`api/_lib/supabase.ts`)

**Before**: Only warned about missing env vars, threw generic error

**After**: 
- Strict validation with clear error messages:
  - `Missing SUPABASE_URL environment variable. Required for Supabase connection.`
  - `Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Required for Supabase connection.`
- Errors thrown synchronously when `getSupabaseClient()` is called

### 2. All API Routes Updated

All routes now have:
- Consistent error logging with `[API][ROUTE_NAME]` prefix
- Try/catch wrapping main logic
- JSON error responses with hint to check logs
- CORS headers set consistently

**Routes Updated**:
- ✅ `/api/dashboard/stats` → `[API][DASHBOARD_STATS]`
- ✅ `/api/registrations` → `[API][REGISTRATIONS]`
- ✅ `/api/blog-posts` → `[API][BLOG_POSTS]`
- ✅ `/api/events` → `[API][EVENTS]`
- ✅ `/api/partners` → `[API][PARTNERS]`
- ✅ `/api/join-requests` → `[API][JOIN_REQUESTS]`

### 3. New Debug Endpoint (`/api/debug-supabase`)

**Purpose**: Test Supabase connection and diagnose env var issues

**Endpoint**: `GET /api/debug-supabase`

**Success Response**:
```json
{
  "ok": true,
  "message": "Supabase connection OK",
  "timestamp": "2025-01-XX...",
  "testQuery": {
    "table": "registrations",
    "result": "Success",
    "rowCount": 0
  }
}
```

**Failure Response** (missing env vars):
```json
{
  "ok": false,
  "error": "Missing SUPABASE_URL environment variable. Required for Supabase connection.",
  "timestamp": "2025-01-XX..."
}
```

**Failure Response** (query error):
```json
{
  "ok": false,
  "error": "Error message from Supabase",
  "code": "PGRST116",
  "details": "...",
  "hint": "...",
  "timestamp": "2025-01-XX..."
}
```

## Error Response Format

All API routes now return consistent error responses:

```json
{
  "error": "Internal server error",
  "hint": "Check server logs for [API][ROUTE_NAME]"
}
```

**Status Code**: Always `500` for server errors

**Content-Type**: Always `application/json` (never HTML)

## Logging Format

All errors are logged with consistent prefixes:

```
[API][ROUTE_NAME] Failed to load [resource]
[API][ROUTE_NAME] Error message: [error message]
[API][ROUTE_NAME] Stack trace: [stack trace]
```

**Example**:
```
[API][DASHBOARD_STATS] Supabase connection failed: Error: Missing SUPABASE_URL environment variable...
[API][DASHBOARD_STATS] Error message: Missing SUPABASE_URL environment variable. Required for Supabase connection.
[API][DASHBOARD_STATS] Stack trace: Error: Missing SUPABASE_URL...
```

## Required Environment Variables

### Backend (API Routes)
- **`SUPABASE_URL`** (required)
  - Format: `https://<project-ref>.supabase.co`
  - Example: `https://cjpzxwqeonxddilqxilw.supabase.co`

- **`SUPABASE_SERVICE_ROLE_KEY`** (required)
  - Format: Long JWT token string
  - Used for admin operations (bypasses RLS)

### Frontend (Optional)
- **`SUPABASE_ANON_KEY`** (optional)
  - Only needed if using Supabase client in frontend
  - Format: Long JWT token string

## Where to Find Errors

### Vercel Function Logs
1. Go to **Vercel Dashboard** → Your Project → **Deployments**
2. Click on a deployment
3. Click **"Functions"** tab
4. Click on any function (e.g., `/api/dashboard/stats`)
5. View **"Logs"** tab

### Search for Error Prefixes
Search logs for:
- `[API][DASHBOARD_STATS]` - Dashboard stats errors
- `[API][REGISTRATIONS]` - Registration errors
- `[API][BLOG_POSTS]` - Blog post errors
- `[API][EVENTS]` - Event errors
- `[API][PARTNERS]` - Partner submission errors
- `[API][JOIN_REQUESTS]` - Join request errors
- `[API][DEBUG_SUPABASE]` - Supabase connection test errors

## Common Error Messages

### Missing Environment Variables

**Error**: `Missing SUPABASE_URL environment variable. Required for Supabase connection.`

**Solution**: 
1. Go to Vercel → Settings → Environment Variables
2. Add `SUPABASE_URL` for Production environment
3. Redeploy

**Error**: `Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Required for Supabase connection.`

**Solution**:
1. Go to Vercel → Settings → Environment Variables
2. Add `SUPABASE_SERVICE_ROLE_KEY` for Production environment
3. Redeploy

### Supabase Connection Errors

**Error**: `Supabase query failed` (in debug endpoint)

**Possible Causes**:
- Supabase project paused or deleted
- Table doesn't exist
- RLS policies blocking access (shouldn't happen with service role key)
- Network issues

**Solution**:
1. Check Supabase Dashboard → Project status
2. Verify table exists: `registrations`
3. Check Supabase logs for more details

## Testing

### Test Supabase Connection
```bash
curl https://ispora.com/api/debug-supabase
```

### Test Individual Routes
```bash
# Dashboard stats
curl https://ispora.com/api/dashboard/stats

# Registrations
curl https://ispora.com/api/registrations

# Blog posts
curl https://ispora.com/api/blog-posts

# Events
curl https://ispora.com/api/events

# Partners
curl https://ispora.com/api/partners

# Join requests
curl https://ispora.com/api/join-requests
```

All should return JSON (not HTML) even on errors.

## Files Changed

1. `api/_lib/supabase.ts` - Added strict env var validation
2. `api/dashboard/stats.ts` - Updated error handling
3. `api/registrations.ts` - Updated error handling
4. `api/blog-posts.ts` - Updated error handling
5. `api/events.ts` - Updated error handling
6. `api/partners.ts` - Updated error handling
7. `api/join-requests.ts` - Updated error handling
8. `api/debug-supabase.ts` - **NEW** debug endpoint
9. `SUPABASE_ENV.md` - **NEW** environment variable documentation

## Next Steps

1. **Verify environment variables are set in Vercel**:
   - Go to Vercel → Settings → Environment Variables
   - Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set for Production

2. **Redeploy**:
   - Push changes to trigger deployment
   - Or manually redeploy from Vercel Dashboard

3. **Test debug endpoint**:
   - Visit `https://ispora.com/api/debug-supabase`
   - Should return `{ "ok": true, ... }` if env vars are configured

4. **Check logs**:
   - If errors persist, check Vercel Function logs
   - Look for `[API][DEBUG_SUPABASE]` or `[API][ROUTE_NAME]` prefixes

## Summary

✅ **Strict env var validation** - Clear error messages when env vars are missing  
✅ **Consistent error logging** - All routes use `[API][ROUTE_NAME]` prefix  
✅ **JSON-only responses** - Never returns HTML on errors  
✅ **Debug endpoint** - `/api/debug-supabase` for connection testing  
✅ **Documentation** - `SUPABASE_ENV.md` with setup instructions  

All API routes now have robust error handling and will provide clear error messages in logs when environment variables are missing or Supabase connection fails.

