# Supabase Environment Variables

## Required Environment Variables

All API routes require the following environment variables to be configured in **Vercel project settings** (Production, Preview, and Development environments).

### Backend Environment Variables

#### `SUPABASE_URL`
- **Description**: Your Supabase project URL
- **Format**: `https://<project-ref>.supabase.co`
- **Example**: `https://cjpzxwqeonxddilqxilw.supabase.co`
- **Required**: Yes
- **Where to find**: Supabase Dashboard → Project Settings → API → Project URL

#### `SUPABASE_SERVICE_ROLE_KEY`
- **Description**: Service role key for admin operations (bypasses Row Level Security)
- **Format**: Long JWT token string
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Required**: Yes
- **Where to find**: Supabase Dashboard → Project Settings → API → Service Role Key
- **⚠️ Security Warning**: This key has full access to your database. Never expose it in client-side code.

#### `SUPABASE_ANON_KEY` (Optional)
- **Description**: Anonymous/public key for client-side operations
- **Format**: Long JWT token string
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Required**: No (only if using Supabase client in frontend)
- **Where to find**: Supabase Dashboard → Project Settings → API → Anon/Public Key

## Configuration in Vercel

### Step 1: Access Vercel Project Settings
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`ispora-website`)
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Environment Variables
For each environment (Production, Preview, Development):

1. Click **"Add New"**
2. Enter variable name: `SUPABASE_URL`
3. Enter variable value: Your Supabase project URL
4. Select environments: Production, Preview, Development (or all)
5. Click **"Save"**

Repeat for:
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY` (if needed)

### Step 3: Redeploy
After adding environment variables:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Or push a new commit to trigger automatic deployment

## Verification

### Test Supabase Connection
After deployment, test the connection:

```bash
curl https://ispora.com/api/debug-supabase
```

Expected response (success):
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

Expected response (failure - missing env vars):
```json
{
  "ok": false,
  "error": "Missing SUPABASE_URL environment variable. Required for Supabase connection.",
  "timestamp": "2025-01-XX..."
}
```

### Check Vercel Function Logs
1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on a deployment
3. Click **"Functions"** tab
4. Click on any function (e.g., `/api/debug-supabase`)
5. View **"Logs"** tab

Look for error messages with prefix `[API][DEBUG_SUPABASE]`:
- `Missing SUPABASE_URL environment variable` → Add `SUPABASE_URL` to Vercel env vars
- `Missing SUPABASE_SERVICE_ROLE_KEY environment variable` → Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel env vars
- `Supabase query failed` → Check Supabase project status and table permissions

## Troubleshooting

### All API Routes Return 500

**Symptom**: All admin API calls return 500 Internal Server Error

**Possible Causes**:
1. **Missing environment variables** (most common)
   - Check Vercel → Settings → Environment Variables
   - Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set for Production
   - Redeploy after adding env vars

2. **Incorrect environment variable values**
   - Verify `SUPABASE_URL` matches your Supabase project URL exactly
   - Verify `SUPABASE_SERVICE_ROLE_KEY` is the Service Role key (not Anon key)

3. **Supabase project paused or deleted**
   - Check Supabase Dashboard → Project status
   - Ensure project is active

**Solution**:
1. Run `/api/debug-supabase` endpoint
2. Check Vercel Function logs for `[API][DEBUG_SUPABASE]` errors
3. Fix missing/incorrect env vars
4. Redeploy

### Environment Variables Not Applied

**Symptom**: Env vars are set in Vercel but API still fails

**Solution**:
1. Ensure env vars are set for **Production** environment (not just Preview/Development)
2. **Redeploy** after adding env vars (they don't apply to existing deployments)
3. Check Vercel Function logs to confirm env vars are being read

### Local Development Works, Production Fails

**Symptom**: API works locally but fails in production

**Cause**: Environment variables are set in `.env.local` but not in Vercel

**Solution**:
1. Copy env vars from `.env.local` to Vercel → Settings → Environment Variables
2. Ensure they're set for **Production** environment
3. Redeploy

## Security Notes

- **Never commit** `.env.local` or environment variable files to Git
- **Never expose** `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- Use `SUPABASE_ANON_KEY` for client-side operations (if needed)
- Use `SUPABASE_SERVICE_ROLE_KEY` only in serverless functions (API routes)

## Summary

**Required for Production**:
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

**Optional**:
- `SUPABASE_ANON_KEY` (only if using Supabase client in frontend)

**Important**: These must be configured in **Vercel project settings** for Production (and Preview) or all API routes will fail with 500 errors.

