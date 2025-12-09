# How to Find Your Supabase URL and Service Role Key

## Step-by-Step Guide

### Step 1: Log in to Supabase

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Sign In"** (top right)
3. Log in with your account

### Step 2: Select Your Project

1. After logging in, you'll see your **Dashboard**
2. Find and click on your project (e.g., `ispora` or your project name)
3. This will take you to your project dashboard

### Step 3: Navigate to Project Settings

1. In the left sidebar, look for **"Settings"** (gear icon ⚙️)
2. Click on **"Settings"**
3. You'll see a submenu appear

### Step 4: Go to API Settings

1. In the Settings submenu, click on **"API"**
2. This will show you all your API credentials

### Step 5: Find Your Credentials

You'll now see a page with several sections:

#### 📍 **Project URL** (This is your `SUPABASE_URL`)

- **Location**: Under the **"Project URL"** section
- **Format**: `https://<project-ref>.supabase.co`
- **Example**: `https://cjpzxwqeonxddilqxilw.supabase.co`
- **Copy this entire URL** - this is your `SUPABASE_URL`

#### 🔑 **Service Role Key** (This is your `SUPABASE_SERVICE_ROLE_KEY`)

- **Location**: Under the **"Project API keys"** section
- **Look for**: **"service_role"** key (NOT the "anon" key)
- **Format**: A long JWT token string starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **⚠️ Important**: 
  - This is the **secret** key (it will be hidden/shown with a toggle)
  - Click **"Reveal"** or the eye icon 👁️ to show the full key
  - Copy the **entire key** - this is your `SUPABASE_SERVICE_ROLE_KEY`

#### 🔓 **Anon Key** (Optional - `SUPABASE_ANON_KEY`)

- **Location**: Same section, labeled **"anon"** or **"public"**
- **When needed**: Only if you're using Supabase client in your frontend
- **Format**: Similar long JWT token string

## Visual Guide

```
Supabase Dashboard
├── Projects
│   └── Your Project (click here)
│       ├── Table Editor
│       ├── SQL Editor
│       ├── Authentication
│       ├── Storage
│       └── Settings ⚙️ (click here)
│           ├── General
│           ├── API ← CLICK HERE
│           │   ├── Project URL: https://xxxxx.supabase.co
│           │   └── Project API keys:
│           │       ├── anon/public: eyJhbGci... (optional)
│           │       └── service_role: eyJhbGci... ← THIS ONE (click Reveal)
│           ├── Database
│           └── ...
```

## Quick Reference

### What You Need for Backend (API Routes)

1. **`SUPABASE_URL`**
   - Found in: **Settings → API → Project URL**
   - Format: `https://<project-ref>.supabase.co`
   - Example: `https://cjpzxwqeonxddilqxilw.supabase.co`

2. **`SUPABASE_SERVICE_ROLE_KEY`**
   - Found in: **Settings → API → Project API keys → service_role**
   - Format: Long JWT token (starts with `eyJ...`)
   - ⚠️ Click "Reveal" to see the full key
   - ⚠️ Keep this secret - never commit to Git

### What You Need for Frontend (Optional)

3. **`SUPABASE_ANON_KEY`** (only if using Supabase client in frontend)
   - Found in: **Settings → API → Project API keys → anon/public**
   - Format: Long JWT token (starts with `eyJ...`)

## After Finding Your Credentials

### Add to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`ispora-website`)
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Add each variable:
   - **Key**: `SUPABASE_URL`
   - **Value**: Your Project URL (from Step 5)
   - **Environments**: Select Production, Preview, Development
   - Click **"Save"**

   Repeat for:
   - **Key**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: Your service_role key (from Step 5)
   - **Environments**: Select Production, Preview, Development
   - Click **"Save"**

6. **Redeploy** your project (or push a new commit)

### Test Your Setup

After adding the environment variables and redeploying:

1. Visit: `https://ispora.com/api/debug-supabase`
2. Should return:
   ```json
   {
     "ok": true,
     "message": "Supabase connection OK",
     ...
   }
   ```

If you see an error, check:
- Environment variables are set in Vercel
- Values are correct (no extra spaces)
- Project is selected for Production environment
- You've redeployed after adding env vars

## Security Notes

⚠️ **Never**:
- Commit these keys to Git
- Share them publicly
- Use service_role key in frontend code
- Expose them in client-side JavaScript

✅ **Always**:
- Keep service_role key secret
- Use environment variables (not hardcoded)
- Use anon key for frontend (if needed)
- Rotate keys if compromised

## Troubleshooting

### "I can't find the API section"
- Make sure you're logged in
- Make sure you've selected your project
- Look for "Settings" in the left sidebar
- Click "API" under Settings

### "I can't see the service_role key"
- Look for a "Reveal" button or eye icon 👁️
- Click it to show the hidden key
- The key is hidden by default for security

### "The key looks incomplete"
- Make sure you clicked "Reveal" to show the full key
- Copy the entire key (it's very long, usually 200+ characters)
- Don't copy just the visible part

### "I have multiple projects"
- Make sure you're in the correct project
- Check the project name in the top left
- Each project has its own unique URL and keys

## Need Help?

If you're still having trouble:
1. Check the Supabase documentation: https://supabase.com/docs/guides/api
2. Verify you have access to the project (you might need to be added as a collaborator)
3. Check Vercel Function logs for specific error messages

