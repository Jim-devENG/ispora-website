# Fix: "new row violates row-level security policy" Error

## Problem

You're seeing this error when uploading images:
```
StorageApiError: new row violates row-level security policy
```

This means the Supabase Storage bucket's RLS (Row Level Security) policies are blocking the upload.

## Quick Fix

### Step 1: Go to Supabase Storage

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Storage** in the left sidebar
4. Click on the **`uploads`** bucket (or create it if it doesn't exist)

### Step 2: Check/Update RLS Policies

1. Click on the **`uploads`** bucket
2. Go to the **"Policies"** tab
3. You should see existing policies

### Step 3: Add/Update Upload Policy

You need a policy that allows **INSERT** (upload) operations. Here's what to do:

#### Option A: Allow Public Uploads (Simplest - for Admin Dashboard)

1. Click **"New Policy"**
2. Choose **"For full customization"**
3. **Policy name**: `Allow public uploads`
4. **Allowed operation**: Select **INSERT**
5. **Policy definition**:
   ```sql
   true
   ```
6. Click **"Review"** → **"Save policy"**

This allows anyone with the anon key to upload files. Since your admin dashboard uses the anon key, this will work.

#### Option B: More Secure (Requires Authentication)

If you want to require authentication:

1. Click **"New Policy"**
2. Choose **"For full customization"**
3. **Policy name**: `Allow authenticated uploads`
4. **Allowed operation**: Select **INSERT**
5. **Policy definition**:
   ```sql
   auth.role() = 'authenticated'
   ```
6. Click **"Review"** → **"Save policy"**

**Note**: This requires users to be authenticated. You'd need to set up Supabase Auth in your admin dashboard.

### Step 4: Verify Policies

You should have at least these policies:

1. ✅ **SELECT** (Read) - `true` (allows public read)
2. ✅ **INSERT** (Upload) - `true` (allows public upload) OR `auth.role() = 'authenticated'`

### Step 5: Test Upload

1. Go back to your admin dashboard
2. Try uploading an image again
3. The error should be gone!

## Complete Policy Setup (SQL)

If you prefer to set up policies via SQL, run this in Supabase SQL Editor:

```sql
-- Allow public read access
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'uploads');

-- Allow public uploads (for admin dashboard)
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'uploads');
```

## Troubleshooting

### Still getting the error?

1. **Check bucket exists**: Make sure the `uploads` bucket exists
2. **Check bucket is public**: Go to Storage → `uploads` → Settings → Make sure "Public bucket" is checked
3. **Check policies**: Go to Storage → `uploads` → Policies → Verify INSERT policy exists
4. **Check policy definition**: Make sure the INSERT policy uses `true` (for public) or `auth.role() = 'authenticated'` (for authenticated)

### "Bucket not found" error?

1. Go to Storage → Click "New bucket"
2. Name: `uploads`
3. Public bucket: ✅ Yes
4. Click "Create bucket"
5. Then set up the policies as above

## Security Note

Allowing public uploads (`true`) means anyone with your anon key can upload files. This is fine for an admin dashboard if:
- The admin dashboard is protected (not publicly accessible)
- You trust the anon key security (it's already exposed in your frontend code)

For production, consider:
- Adding authentication to your admin dashboard
- Using service role key in a serverless function (but that uses a function slot)
- Adding file size/type restrictions in bucket settings

## Summary

✅ Go to Supabase → Storage → `uploads` bucket → Policies  
✅ Add INSERT policy with `true` (allows public uploads)  
✅ Test upload again  

That's it! The upload should work now.

