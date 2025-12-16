# Vercel Environment Variables Setup

## Quick Fix for Image Uploads

Your Supabase environment variables are missing in Vercel production. Follow these steps to add them:

## Step 1: Go to Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`ispora-website` or your project name)
3. Click on **Settings** (gear icon in the top navigation)
4. Click on **Environment Variables** in the left sidebar

## Step 2: Add Frontend Environment Variables

Add these **two** environment variables:

### Variable 1: `VITE_SUPABASE_URL`

1. Click **"Add New"**
2. **Key**: `VITE_SUPABASE_URL`
3. **Value**: `https://cjpzxwqeonxddilqxilw.supabase.co`
4. **Environments**: ✅ Production, ✅ Preview, ✅ Development
5. Click **"Save"**

### Variable 2: `VITE_SUPABASE_ANON_KEY`

1. Click **"Add New"** again
2. **Key**: `VITE_SUPABASE_ANON_KEY`
3. **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqcHp4d3Flb254ZGRpbHF4aWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5ODU3NDEsImV4cCI6MjA4MDU2MTc0MX0.QHX05mz3T0rdHn2qdwq2gRc1hdBhJSE7WfYsmw3Rfl8`
4. **Environments**: ✅ Production, ✅ Preview, ✅ Development
5. Click **"Save"**

## Step 3: Verify Backend Variables (Already Set)

Make sure these are also set (they should already be there for API routes):

- ✅ `SUPABASE_URL` = `https://cjpzxwqeonxddilqxilw.supabase.co`
- ✅ `SUPABASE_SERVICE_ROLE_KEY` = (your service role key)

## Step 4: Redeploy

After adding the environment variables:

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger a new deployment

## Step 5: Verify

After redeployment:

1. Go to your site: `https://ispora.com/admin`
2. Try uploading an image in Blog or Events tab
3. Check browser console - you should **NOT** see the Supabase error anymore

## Troubleshooting

### Still seeing errors?

1. **Check environment variables are set**:
   - Go to Vercel → Settings → Environment Variables
   - Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` exist
   - Make sure they're enabled for **Production** environment

2. **Verify the values**:
   - `VITE_SUPABASE_URL` should be: `https://cjpzxwqeonxddilqxilw.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` should start with `eyJhbGci...`

3. **Force a rebuild**:
   - After adding env vars, trigger a new deployment
   - Environment variables are only available in new builds

4. **Check Supabase Storage bucket**:
   - Make sure you've created the `uploads` bucket in Supabase Storage
   - See `SUPABASE_STORAGE_SETUP.md` for bucket setup

## Why These Variables?

- **`VITE_SUPABASE_URL`**: Your Supabase project URL (needed to connect to Supabase)
- **`VITE_SUPABASE_ANON_KEY`**: Public/anonymous key (safe to expose, protected by RLS policies)

These are **frontend** variables (prefixed with `VITE_`) because they're used in the browser. The backend uses `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (without `VITE_` prefix).

## Summary

✅ Add `VITE_SUPABASE_URL` to Vercel  
✅ Add `VITE_SUPABASE_ANON_KEY` to Vercel  
✅ Redeploy  
✅ Test image upload  

That's it! Image uploads will work after this.

