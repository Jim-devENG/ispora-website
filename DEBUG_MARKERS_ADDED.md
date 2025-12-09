# Debug Markers Added - Deployment Verification

## Summary

Added visual debug markers and API endpoint to verify which deployment is being served.

---

## Changes Made

### 1. Admin Dashboard Debug Marker
**File**: `frontend/components/admin/AdminDashboard.tsx`

**Added at line 207** (top of component return):
```tsx
<div className="fixed top-0 left-0 z-[9999] px-2 py-1 text-[10px] bg-red-600 text-white font-mono">
  ADMIN DEBUG BUILD — DO NOT SHIP — {import.meta.env.MODE} — {new Date().toISOString().slice(0, 10)}
</div>
```

**Location**: Top-left corner, red background, always visible

### 2. Home Page Debug Marker
**File**: `frontend/components/HomePage.tsx`

**Added at line 35** (top of component return):
```tsx
<div className="fixed top-0 right-0 z-[9999] px-2 py-1 text-[10px] bg-emerald-600 text-white font-mono">
  PUBLIC DEBUG BUILD — {import.meta.env.MODE} — {new Date().toISOString().slice(0, 10)}
</div>
```

**Location**: Top-right corner, green background, always visible

### 3. Debug API Endpoint Updated
**File**: `api/debug-alive.ts`

**Updated commitHint** to: `"admin-rebuild-debug-v1"`

**Response now includes**:
```json
{
  "ok": true,
  "route": "/api/debug-alive",
  "timestamp": "2025-01-15T...",
  "commitHint": "admin-rebuild-debug-v1",
  "buildInfo": {
    "nodeEnv": "production",
    "vercelEnv": "production",
    "deploymentDate": "2025-01-15"
  }
}
```

### 4. Legacy Netlify Config Annotated
**File**: `netlify.toml`

**Added warning comment** at top explaining this is legacy and should not be used.

### 5. Deployment Checklist Created
**File**: `DEPLOYMENT_CHECKLIST.md`

Complete step-by-step checklist for verifying deployment.

---

## How /admin Route is Wired

### Route Definition
**File**: `frontend/App.tsx` (line 148-149)

```tsx
case 'admin':
  return isAdminAuthenticated ? <AdminDashboard /> : <AdminAccess onAccessGranted={handleAdminAccess} />;
```

### Admin Entry Component
**File**: `frontend/components/admin/AdminDashboard.tsx`

- Exported as: `export function AdminDashboard()`
- Imported in: `frontend/App.tsx` as `import { AdminDashboard } from './components/admin/AdminDashboard';`
- Route handling: Custom routing via `currentPage` state in `App.tsx`
- URL path: `/admin` (handled by Vercel rewrite to `/index.html`)

### Routing Mechanism
- Uses hash-free routing with `window.history.pushState`
- `currentPage` state determines which component renders
- `/admin` path sets `currentPage` to `'admin'`
- Vercel rewrite: `/admin` → `/index.html` (SPA fallback)

---

## API Routes Location & Style

### Location
**Folder**: `api/` (root level)

### Style
**Pattern**: `export default async function handler(req: VercelRequest, res: VercelResponse)`

### Examples
- `api/debug-alive.ts` - Debug endpoint
- `api/dashboard/stats.ts` - Dashboard stats
- `api/registrations.ts` - Registrations CRUD
- `api/blog-posts.ts` - Blog posts CRUD
- `api/events.ts` - Events CRUD

### Vercel Configuration
**File**: `vercel.json`

```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

Vercel auto-detects `api/**/*.ts` files as serverless functions.

---

## Legacy Deployment Config Found

### Netlify Configuration
**File**: `netlify.toml`

**Status**: ⚠️ **LEGACY - NOT USED**

**Contents**:
- Build config for Netlify
- Function redirects to `netlify/functions/`
- Security headers

**Impact**: If `ispora.com` DNS is still pointing to Netlify, it would serve old code from `netlify/functions/` instead of Vercel's `api/` routes.

**Action Taken**: Added warning comment at top of file.

### Netlify Functions Directory
**Location**: `netlify/functions/`

**Status**: ⚠️ **LEGACY - NOT USED**

**Contents**:
- Old serverless functions (JavaScript)
- MongoDB connection helpers
- Old registration handlers

**Impact**: These are not used by Vercel deployment. If domain points to Netlify, these would be used instead.

---

## Verification Steps

### 1. Test Vercel Deployment URL
Visit: `https://<project-name>.vercel.app/admin`

**Expected**:
- ✅ Red debug banner: `ADMIN DEBUG BUILD — DO NOT SHIP — production — YYYY-MM-DD`
- ✅ New admin dashboard with tabs

### 2. Test Production Domain
Visit: `https://ispora.com/admin`

**Expected**:
- ✅ Same red debug banner as Vercel URL
- ✅ Same new admin dashboard

**If different**: Domain is pointing to wrong deployment/project

### 3. Test Debug API
Visit: `https://ispora.com/api/debug-alive`

**Expected**:
- ✅ JSON response with `commitHint: "admin-rebuild-debug-v1"`
- ✅ Status 200, Content-Type: application/json

---

## File Paths Summary

| Component | File Path |
|-----------|-----------|
| Admin Entry | `frontend/components/admin/AdminDashboard.tsx` |
| Public Entry | `frontend/components/HomePage.tsx` |
| Route Handler | `frontend/App.tsx` (line 148-149) |
| Debug API | `api/debug-alive.ts` |
| Deployment Checklist | `DEPLOYMENT_CHECKLIST.md` |
| Legacy Netlify Config | `netlify.toml` (annotated) |

---

## Next Steps

1. **Commit and push** these changes
2. **Wait for Vercel deployment** (2-3 minutes)
3. **Test Vercel URL**: Should show debug banners
4. **Test production domain**: Should match Vercel URL exactly
5. **If they differ**: Follow `DEPLOYMENT_CHECKLIST.md` troubleshooting

---

## Removing Debug Markers (Before Final Production)

When ready to remove debug markers:

1. Remove debug banner from `AdminDashboard.tsx` (lines 208-211)
2. Remove debug banner from `HomePage.tsx` (lines 36-39)
3. Update `commitHint` in `api/debug-alive.ts` to production value
4. Commit and deploy

