# Supabase Storage Setup for Image Uploads

## Overview

Image uploads are now handled directly in the frontend using Supabase Storage. This doesn't require a serverless function, so it doesn't count toward the Vercel function limit.

## Step 1: Create Storage Bucket in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Storage** in the left sidebar
4. Click **"New bucket"**
5. Configure:
   - **Name**: `uploads`
   - **Public bucket**: ✅ **Yes** (checked) - This allows public access to uploaded images
   - **File size limit**: 5 MB (or your preferred limit)
   - **Allowed MIME types**: `image/*` (or specific types like `image/jpeg,image/png,image/gif,image/webp`)
6. Click **"Create bucket"**

## Step 2: Set Up Storage Policies (RLS)

After creating the bucket, you need to set up Row Level Security (RLS) policies:

### Policy 1: Allow Public Read Access

1. Go to **Storage** → **Policies** → Select `uploads` bucket
2. Click **"New Policy"**
3. Choose **"For full customization"**
4. Policy name: `Allow public read access`
5. Allowed operation: **SELECT** (Read)
6. Policy definition:
   ```sql
   true
   ```
7. Click **"Review"** → **"Save policy"**

### Policy 2: Allow Authenticated Uploads

1. Click **"New Policy"** again
2. Policy name: `Allow authenticated uploads`
3. Allowed operation: **INSERT** (Upload)
4. Policy definition:
   ```sql
   auth.role() = 'authenticated'
   ```
5. Click **"Review"** → **"Save policy"**

### Policy 3: Allow Authenticated Updates/Deletes (Optional)

If you want users to be able to update/delete their own uploads:

1. Click **"New Policy"**
2. Policy name: `Allow authenticated updates`
3. Allowed operation: **UPDATE**
4. Policy definition:
   ```sql
   auth.role() = 'authenticated'
   ```
5. Repeat for **DELETE** operation

**OR** for admin-only (service role):

Since the admin dashboard uses service role, you can also allow service role full access:

```sql
-- For INSERT, UPDATE, DELETE
auth.role() = 'service_role'
```

## Step 3: Configure Frontend Environment Variables

Add these to your `.env.local` file (and Vercel environment variables):

```env
VITE_SUPABASE_URL=https://cjpzxwqeonxddilqxilw.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Where to find:**
- Go to Supabase Dashboard → Settings → API
- **Project URL**: Copy this as `VITE_SUPABASE_URL`
- **anon/public key**: Copy this as `VITE_SUPABASE_ANON_KEY`

## Step 4: Add to Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: Your Supabase project URL
   - **Environments**: Production, Preview, Development
3. Add:
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon/public key
   - **Environments**: Production, Preview, Development
4. **Redeploy** after adding

## Step 5: Test Image Upload

1. Go to Admin Dashboard → Blog or Events tab
2. Click **"New Post"** or **"New Event"**
3. Click the image upload area
4. Select an image file
5. The image should upload to Supabase Storage and display a preview

## Storage Structure

Images are stored in Supabase Storage with this structure:

```
uploads/
  ├── blog/
  │   ├── 1234567890-abc123.jpg
  │   └── 1234567891-def456.png
  └── event/
      ├── 1234567892-ghi789.jpg
      └── 1234567893-jkl012.png
```

## Troubleshooting

### "Failed to upload image to Supabase Storage"

**Possible causes:**
1. **Bucket doesn't exist**: Create the `uploads` bucket in Supabase Storage
2. **RLS policies not set**: Set up the policies as described above
3. **Missing environment variables**: Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
4. **Bucket not public**: Make sure the bucket is set to "Public bucket"

### "Storage bucket 'uploads' not found"

**Solution:**
1. Go to Supabase Dashboard → Storage
2. Create a bucket named `uploads`
3. Make it public
4. Set up RLS policies

### "Permission denied" or "Row Level Security policy violation"

**Solution:**
1. Check RLS policies for the `uploads` bucket
2. Ensure policies allow:
   - **SELECT** (read) for public access
   - **INSERT** (upload) for authenticated users or service role
3. If using service role, add policy: `auth.role() = 'service_role'`

### Images not displaying

**Possible causes:**
1. **Bucket not public**: Make sure the bucket is set to "Public bucket" in Supabase
2. **RLS policy blocking reads**: Ensure SELECT policy allows public access
3. **CORS issues**: Supabase Storage handles CORS automatically, but check browser console

## Security Notes

- ✅ **Public bucket**: Safe for images that should be publicly accessible
- ✅ **RLS policies**: Control who can upload/read/delete
- ✅ **File size limits**: Set in bucket settings (default 5MB)
- ✅ **MIME type restrictions**: Can restrict to specific image types

## Alternative: Private Bucket with Signed URLs

If you need private images:

1. Create bucket as **private** (not public)
2. Use `getSignedUrl()` instead of `getPublicUrl()`
3. URLs will expire after a set time (e.g., 1 hour)

Example:
```typescript
const { data } = await supabase.storage
  .from('uploads')
  .createSignedUrl(filePath, 3600); // 1 hour expiry
```

## Summary

✅ **No serverless function needed** - Uploads happen directly from frontend  
✅ **Uses Supabase Storage** - Reliable, scalable file storage  
✅ **Public URLs** - Images are accessible via public URLs  
✅ **RLS protected** - Upload permissions controlled by policies  

The ImageUpload component now uploads directly to Supabase Storage without needing the `/api/upload-image` endpoint.

