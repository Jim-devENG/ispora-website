# How to Get Your Supabase Project URL

## Quick Steps

### Method 1: From Supabase Dashboard (Easiest)

1. **Go to Supabase Dashboard**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Sign in if needed

2. **Select Your Project**
   - Click on your project name (e.g., `ispora` or your project name)
   - This opens your project dashboard

3. **Go to Settings**
   - Look at the **left sidebar**
   - Click on **"Settings"** (gear icon ⚙️)

4. **Click on "API"**
   - In the Settings submenu, click **"API"**

5. **Find "Project URL"**
   - Scroll down to the **"Project URL"** section
   - You'll see a URL like: `https://cjpzxwqeonxddilqxilw.supabase.co`
   - **Copy this entire URL** - this is your `SUPABASE_URL`

### Method 2: From Project URL Bar

1. **Look at your browser's address bar** when you're in your Supabase project
2. The URL will look like: `https://supabase.com/dashboard/project/cjpzxwqeonxddilqxilw`
3. The part after `/project/` is your **project reference ID**
4. Your Project URL is: `https://cjpzxwqeonxddilqxilw.supabase.co`
   - Replace `cjpzxwqeonxddilqxilw` with your actual project reference ID

### Method 3: From Project Settings → General

1. Go to **Settings** → **General**
2. Look for **"Reference ID"** or **"Project ID"**
3. Your Project URL format is: `https://<reference-id>.supabase.co`

## Visual Guide

```
Supabase Dashboard
│
├── [Your Project Name] ← Click here
│   │
│   ├── Left Sidebar:
│   │   ├── Table Editor
│   │   ├── SQL Editor
│   │   ├── Authentication
│   │   ├── Storage
│   │   └── Settings ⚙️ ← Click here
│   │       │
│   │       ├── General
│   │       ├── API ← Click here
│   │       │   │
│   │       │   └── Project URL:
│   │       │       https://cjpzxwqeonxddilqxilw.supabase.co ← COPY THIS
│   │       │
│   │       └── Database
│   │
│   └── Browser Address Bar:
│       https://supabase.com/dashboard/project/cjpzxwqeonxddilqxilw
│                                                      ↑
│                                              This is your project ref
│                                              URL = https://[this].supabase.co
```

## What It Looks Like

Your Supabase Project URL will be in this format:

```
https://[project-reference-id].supabase.co
```

**Example:**
```
https://cjpzxwqeonxddilqxilw.supabase.co
```

## Where to Use It

Once you have your Project URL, add it to:

### Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`ispora-website`)
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Enter:
   - **Key**: `SUPABASE_URL`
   - **Value**: `https://cjpzxwqeonxddilqxilw.supabase.co` (your actual URL)
   - **Environments**: Select Production, Preview, Development
6. Click **"Save"**

### Local Development (.env.local)

If you're testing locally, create a `.env.local` file in your project root:

```env
SUPABASE_URL=https://cjpzxwqeonxddilqxilw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

⚠️ **Never commit `.env.local` to Git!**

## Verify You Have the Right URL

Your Supabase Project URL should:
- ✅ Start with `https://`
- ✅ Contain your project reference ID
- ✅ End with `.supabase.co`
- ✅ Be unique to your project

**Example of correct format:**
```
✅ https://cjpzxwqeonxddilqxilw.supabase.co
✅ https://abcdefghijklmnop.supabase.co
```

**Examples of incorrect format:**
```
❌ https://supabase.com/dashboard/project/xxxxx (this is the dashboard URL, not project URL)
❌ cjpzxwqeonxddilqxilw.supabase.co (missing https://)
❌ https://cjpzxwqeonxddilqxilw.supabase.com (wrong domain, should be .co)
```

## Troubleshooting

### "I can't find the API section"
- Make sure you're logged into Supabase
- Make sure you've selected your project (not just the dashboard)
- Look for "Settings" in the left sidebar
- Click "API" under Settings

### "I see multiple URLs"
- Use the one labeled **"Project URL"** (not "API URL" or "Database URL")
- It should be in the format: `https://xxxxx.supabase.co`

### "The URL doesn't work"
- Make sure you copied the **entire URL** including `https://`
- Make sure it ends with `.supabase.co` (not `.com`)
- Verify your project is active (not paused) in Supabase

### "I have multiple projects"
- Make sure you're in the **correct project**
- Each project has its own unique URL
- Check the project name in the top left of the dashboard

## Quick Checklist

- [ ] Logged into Supabase Dashboard
- [ ] Selected the correct project
- [ ] Went to Settings → API
- [ ] Found "Project URL" section
- [ ] Copied the entire URL (including `https://`)
- [ ] URL format: `https://xxxxx.supabase.co`
- [ ] Added to Vercel Environment Variables
- [ ] Selected Production, Preview, and Development environments
- [ ] Redeployed after adding

## Next Steps

After getting your Project URL:

1. **Add to Vercel**: Settings → Environment Variables → Add `SUPABASE_URL`
2. **Get Service Role Key**: Settings → API → Project API keys → service_role (click Reveal)
3. **Add Service Role Key to Vercel**: Same process as above
4. **Redeploy**: Push a commit or manually redeploy from Vercel
5. **Test**: Visit `https://ispora.com/api/debug-supabase` to verify connection

## Need More Help?

- Check Supabase docs: https://supabase.com/docs/guides/api
- Check your project status in Supabase Dashboard
- Verify you have access to the project (you might need to be added as a collaborator)

