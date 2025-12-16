# Deployment Verification Checklist

## Purpose
This checklist helps verify that `ispora.com` is serving the correct deployment with the new admin dashboard and debug markers.

---

## STEP 1: Verify Vercel Project & Repository

### 1.1 Check Vercel Project Settings
- [ ] Go to **Vercel Dashboard** → Your Project → **Settings** → **General**
- [ ] Confirm **Git Repository** shows: `Jim-devENG/ispora-website` (or correct repo)
- [ ] Confirm **Production Branch** is: `master` (or `main`)
- [ ] Confirm **Root Directory** is: `.` (root) or empty
- [ ] Confirm **Build Command** is: `npm run build`
- [ ] Confirm **Output Directory** is: `dist`
- [ ] Confirm **Install Command** is: `npm install` (or default)

### 1.2 Verify Latest Deployment
- [ ] Go to **Vercel Dashboard** → **Deployments**
- [ ] Check the **latest Production deployment**
- [ ] Confirm it includes commit: `6c59d36` or later (should have debug markers)
- [ ] Check **Build Logs** for any errors
- [ ] Verify build completed successfully (not failed)

### 1.3 Check Deployment URL
- [ ] Note the **Vercel deployment URL**: `https://<project-name>.vercel.app`
- [ ] This is your "source of truth" - if this shows new code, Vercel is working

---

## STEP 2: Verify Domain Mapping

### 2.1 Check Vercel Domain Settings
- [ ] Go to **Vercel Dashboard** → Your Project → **Settings** → **Domains**
- [ ] Confirm `ispora.com` is listed and attached to **this project**
- [ ] Confirm domain status is **"Valid"** or **"Configured"**
- [ ] If domain is missing or pointing to different project, **this is the problem**

### 2.2 Check DNS Configuration
- [ ] Go to your DNS provider (Namecheap)
- [ ] Check DNS records for `ispora.com`:
  - [ ] **A Record**: `@` → `216.198.79.1` (for root domain)
  - [ ] **CNAME Record**: `www` → `cf09c2bad433f855.vercel-dns-017.com.` (for www subdomain)
- [ ] Verify DNS records match **exactly** what Vercel shows in Domain settings
- [ ] If Vercel shows "Invalid Configuration":
  - [ ] Wait 15-30 minutes for DNS propagation
  - [ ] Click "Refresh" in Vercel domain settings
  - [ ] Verify records are correct in Namecheap
- [ ] Verify DNS is **NOT** pointing to:
  - [ ] Netlify (e.g., `netlify.com` or `netlify.app`)
  - [ ] Render (e.g., `render.com`)
  - [ ] Any other hosting provider

### 2.3 Check for Other Hosting Platforms
- [ ] **Netlify Dashboard**: Check if `ispora.com` is still connected to a Netlify site
  - If yes, disconnect it or delete the site
- [ ] **Render Dashboard**: Check if `ispora.com` is still connected to a Render service
  - If yes, delete or disconnect it
- [ ] **Any other hosting**: Check all hosting platforms you've used

---

## STEP 3: Runtime Verification Steps

### 3.1 Test Vercel Deployment URL (Source of Truth)
Visit: `https://<project-name>.vercel.app/`

**Expected Results:**
- [ ] ✅ See **green debug banner** at top-right: `PUBLIC DEBUG BUILD — production — YYYY-MM-DD`
- [ ] ✅ Page loads correctly
- [ ] ✅ No console errors

**If you DON'T see the debug banner:**
- The Vercel deployment doesn't have the new code
- Check build logs for errors
- Verify the correct commit was deployed

### 3.2 Test Admin on Vercel URL
Visit: `https://<project-name>.vercel.app/admin`

**Expected Results:**
- [ ] ✅ See **red debug banner** at top-left: `ADMIN DEBUG BUILD — DO NOT SHIP — production — YYYY-MM-DD`
- [ ] ✅ See new admin dashboard with tabs (Overview, Registrations, Blog, Events, Partners, Join Requests)
- [ ] ✅ Dark slate theme (`bg-slate-950`)
- [ ] ✅ Subtitle: "Manage registrations, content, and partners"
- [ ] ✅ "New Dashboard v2.0" text visible

**If you see OLD admin dashboard:**
- Vercel is serving old code
- Check deployment commit hash
- Clear build cache and redeploy

### 3.3 Test Debug API Endpoint
Visit: `https://<project-name>.vercel.app/api/debug-alive`

**Expected Results:**
- [ ] ✅ Returns JSON: `{ "ok": true, "route": "/api/debug-alive", "commitHint": "admin-rebuild-debug-v1", ... }`
- [ ] ✅ Status: `200 OK`
- [ ] ✅ Content-Type: `application/json`

**If you get HTML or 404:**
- API route not deployed
- Check Vercel Functions tab for `/api/debug-alive`
- Check build logs for TypeScript errors

### 3.4 Test Production Domain
Visit: `https://ispora.com/`

**Expected Results:**
- [ ] ✅ See **green debug banner** at top-right (same as Vercel URL)
- [ ] ✅ Content matches Vercel deployment URL exactly

**If you DON'T see debug banner:**
- Domain is NOT pointing to this Vercel project
- Check DNS settings
- Check if domain is connected to different Vercel project
- Check if domain is still on Netlify/Render

### 3.5 Test Admin on Production Domain
Visit: `https://ispora.com/admin`

**Expected Results:**
- [ ] ✅ See **red debug banner** at top-left (same as Vercel URL)
- [ ] ✅ See new admin dashboard (same as Vercel URL)
- [ ] ✅ Content matches Vercel deployment URL exactly

**If you see OLD admin dashboard:**
- Domain is pointing to old deployment or different project
- Follow troubleshooting steps below

---

## STEP 4: If Live Still Shows Old Admin

### 4.1 Likely Causes Checklist
- [ ] **Wrong Vercel Project**: `ispora.com` is connected to a different Vercel project
  - **Fix**: Vercel Dashboard → Project → Settings → Domains → Verify correct project
  
- [ ] **Domain Still on Netlify**: DNS is pointing to Netlify instead of Vercel
  - **Fix**: Update DNS records to point to Vercel
  
- [ ] **Domain Still on Render**: DNS is pointing to Render instead of Vercel
  - **Fix**: Update DNS records to point to Vercel
  
- [ ] **Build Failed**: Latest deployment failed, Vercel serving last successful build
  - **Fix**: Check build logs, fix errors, redeploy
  
- [ ] **Wrong Branch**: Production branch is set to wrong branch (not `master`)
  - **Fix**: Vercel Settings → Git → Change production branch
  
- [ ] **Build Cache**: Old build cached, new code not being built
  - **Fix**: Redeploy with "Clear cache" checked

### 4.2 Troubleshooting Steps

1. **Compare URLs Side-by-Side**:
   - Open `https://<project>.vercel.app/admin` in one tab
   - Open `https://ispora.com/admin` in another tab
   - Compare visually:
     - Do they show the same debug banners?
     - Do they show the same admin dashboard?
     - If NO → Domain is pointing to wrong deployment

2. **Check Deployment URLs**:
   - In Vercel Dashboard → Deployments → Latest
   - Note the **deployment URL** (e.g., `ispora-page-abc123.vercel.app`)
   - Visit that URL directly
   - Does it show new admin? If YES → Domain mapping issue. If NO → Build issue.

3. **DNS Propagation Check**:
   - Use `nslookup ispora.com` or `dig ispora.com`
   - Check what IP/hostname it resolves to
   - Should resolve to Vercel, not Netlify/Render

4. **Check Vercel Domain Assignment**:
   - Vercel Dashboard → Project → Settings → Domains
   - If `ispora.com` is NOT listed → Add it
   - If listed but shows different project → Remove and re-add to correct project

---

## STEP 5: Verification Summary

After completing all checks, confirm:

- [ ] Vercel deployment URL shows new admin with debug banners ✅
- [ ] `ispora.com` shows **exact same content** as Vercel URL ✅
- [ ] Debug API endpoint `/api/debug-alive` returns correct JSON ✅
- [ ] No old Netlify/Render deployments interfering ✅

**If all above are true:** ✅ Deployment is correct!

**If any are false:** Follow troubleshooting steps in Section 4.

---

## Quick Reference

### Debug Markers to Look For

**Public Page (`/`):**
- Green banner: `PUBLIC DEBUG BUILD — production — YYYY-MM-DD`
- Location: Top-right corner

**Admin Page (`/admin`):**
- Red banner: `ADMIN DEBUG BUILD — DO NOT SHIP — production — YYYY-MM-DD`
- Location: Top-left corner

**Debug API (`/api/debug-alive`):**
- JSON response with `commitHint: "admin-rebuild-debug-v1"`

### File Locations

- **Admin Entry**: `frontend/App.tsx` (line 148-149) → `frontend/components/admin/AdminDashboard.tsx`
- **Public Entry**: `frontend/App.tsx` (line 101) → `frontend/components/HomePage.tsx`
- **Debug API**: `api/debug-alive.ts`
- **Legacy Netlify Config**: `netlify.toml` (annotated as legacy)

---

## Notes

- Debug banners are intentionally obvious and should be removed before final production release
- The `commitHint` in `/api/debug-alive` helps verify which code version is deployed
- If Vercel URL and production domain show different content, it's **always** a domain/DNS issue, not a code issue

