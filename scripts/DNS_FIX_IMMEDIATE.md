# DNS Configuration - Immediate Fix Guide

## Current Status Analysis

### ✅ Your DNS Records Are CORRECT

**Namecheap DNS** (matches Vercel requirements):
- ✅ A Record: `@` → `216.198.79.1` 
- ✅ CNAME: `www` → `cf09c2bad433f855.vercel-dns-017.com.`

**Vercel Requirements**:
- ✅ A Record: `@` → `216.198.79.1`
- ✅ CNAME: `www` → `cf09c2bad433f855.vercel-dns-017.com.`

### ⚠️ Why "Invalid Configuration"?

Vercel shows "Invalid Configuration" when DNS records are correct but:
1. **DNS hasn't propagated yet** (most common - can take 15 minutes to 48 hours)
2. **Vercel hasn't verified the records yet** (needs manual refresh)
3. **Domain was just added** (Vercel needs time to check)

## Immediate Actions

### Step 1: Refresh Domain in Vercel

1. Go to **Vercel Dashboard** → `ispora-website` project → **Settings** → **Domains**
2. Find `ispora.com` in the list
3. Click the **three dots** (⋯) next to it
4. Click **"Refresh"** or **"Verify"**
5. Wait 2-3 minutes
6. Check if status changes to "Valid Configuration"

### Step 2: Verify DNS Propagation

Check if DNS has propagated globally:

**Option A: Online Tool**
- Visit: https://dnschecker.org/#A/ispora.com
- Should show `216.198.79.1` from multiple locations
- Visit: https://dnschecker.org/#CNAME/www.ispora.com
- Should show `cf09c2bad433f855.vercel-dns-017.com.` from multiple locations

**Option B: Command Line**
```bash
# Check A record
nslookup ispora.com
# Should return: 216.198.79.1

# Check CNAME
nslookup www.ispora.com
# Should return: cf09c2bad433f855.vercel-dns-017.com.
```

### Step 3: Test Domain Resolution

After DNS propagates (15-30 minutes):

1. **Test root domain**:
   - Visit: `https://ispora.com`
   - Should show green debug banner: `PUBLIC DEBUG BUILD — production — YYYY-MM-DD`
   - Should match `https://ispora-website.vercel.app` exactly

2. **Test admin**:
   - Visit: `https://ispora.com/admin`
   - Should show red debug banner: `ADMIN DEBUG BUILD — DO NOT SHIP — production — YYYY-MM-DD`
   - Should match `https://ispora-website.vercel.app/admin` exactly

3. **Test debug API**:
   - Visit: `https://ispora.com/api/debug-alive`
   - Should return JSON: `{ "ok": true, "commitHint": "admin-rebuild-debug-v1", ... }`

## If Still "Invalid Configuration" After 30 Minutes

### Option 1: Remove and Re-add Domain

1. **Vercel Dashboard** → Settings → Domains
2. Click **"Remove"** on `ispora.com` and `www.ispora.com`
3. Wait 2 minutes
4. Click **"Add Domain"**
5. Enter `ispora.com` (Vercel will auto-add `www.ispora.com`)
6. Copy the **exact DNS records** Vercel shows
7. Verify they match your Namecheap records
8. Click **"Refresh"** after 5 minutes

### Option 2: Verify Domain Assignment

1. **Vercel Dashboard** → Settings → Domains
2. Confirm `ispora.com` is assigned to **`ispora-website`** project
3. If it's assigned to a different project:
   - Remove it from wrong project
   - Add it to `ispora-website` project

## Expected Timeline

- **DNS Propagation**: 15 minutes - 4 hours (typically)
- **Vercel Verification**: 2-5 minutes after DNS propagates
- **Full Resolution**: Up to 48 hours in rare cases

## Verification Checklist

After waiting 15-30 minutes:

- [ ] DNS records match exactly (they do ✅)
- [ ] Clicked "Refresh" in Vercel domain settings
- [ ] Verified domain is assigned to `ispora-website` project
- [ ] Tested `https://ispora.com` - shows green debug banner
- [ ] Tested `https://ispora.com/admin` - shows red debug banner
- [ ] Both match `https://ispora-website.vercel.app` exactly

## Quick Test

Right now, test these URLs:

1. **Vercel URL** (source of truth):
   ```
   https://ispora-website.vercel.app/admin
   ```
   - Should show: Red debug banner + new admin dashboard

2. **Production Domain**:
   ```
   https://ispora.com/admin
   ```
   - Should match Vercel URL exactly
   - If different → DNS not pointing to Vercel yet

3. **Debug API**:
   ```
   https://ispora.com/api/debug-alive
   ```
   - Should return JSON with `commitHint: "admin-rebuild-debug-v1"`

## If Production Domain Shows Old Admin

This confirms DNS is pointing to wrong deployment:

1. **Check DNS records** are correct (they are ✅)
2. **Wait for DNS propagation** (15-30 minutes)
3. **Refresh domain in Vercel**
4. **Verify domain assignment** to correct project

The DNS records you have are correct - it's just a matter of waiting for propagation and Vercel verification.

