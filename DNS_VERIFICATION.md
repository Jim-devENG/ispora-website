# DNS Configuration Verification

## Current Status

### Vercel Domain Settings
- `ispora.com` - **Invalid Configuration** ⚠️
- `www.ispora.com` - **Invalid Configuration** ⚠️
- `ispora-website.vercel.app` - **Valid Configuration** ✅

### Namecheap DNS Records (Current)
- **A Record**: `@` → `216.198.79.1` ✅ (Matches Vercel requirement)
- **CNAME Record**: `www` → `cf09c2bad433f855.vercel-dns-017.com.` ✅ (Matches Vercel requirement)

## Why "Invalid Configuration"?

Vercel shows "Invalid Configuration" when:
1. DNS records don't match exactly what Vercel expects
2. DNS hasn't propagated yet (can take up to 48 hours)
3. Domain is pointing to a different Vercel project
4. DNS records are correct but Vercel hasn't verified them yet

## Verification Steps

### Step 1: Verify DNS Records Match Exactly

**Vercel Requires:**

For `ispora.com` (root domain):
- **Type**: A
- **Name**: `@` (or blank/root)
- **Value**: `216.198.79.1` ✅

For `www.ispora.com`:
- **Type**: CNAME
- **Name**: `www`
- **Value**: `cf09c2bad433f855.vercel-dns-017.com.` ✅

**Your Namecheap Records:**
- ✅ A Record: `@` → `216.198.79.1` (CORRECT)
- ✅ CNAME: `www` → `cf09c2bad433f855.vercel-dns-017.com.` (CORRECT)

### Step 2: Check DNS Propagation

Run these commands to verify DNS:

```bash
# Check A record for root domain
nslookup ispora.com
# Should resolve to: 216.198.79.1

# Check CNAME for www
nslookup www.ispora.com
# Should resolve to: cf09c2bad433f855.vercel-dns-017.com.
```

Or use online tools:
- https://dnschecker.org/#A/ispora.com
- https://dnschecker.org/#CNAME/www.ispora.com

### Step 3: Wait for DNS Propagation

DNS changes can take:
- **Minimum**: 5-15 minutes
- **Typical**: 1-4 hours
- **Maximum**: 24-48 hours

### Step 4: Verify Domain Assignment in Vercel

1. Go to **Vercel Dashboard** → Project → **Settings** → **Domains**
2. Check if `ispora.com` is listed
3. If NOT listed:
   - Click **"Add Domain"**
   - Enter `ispora.com`
   - Follow Vercel's instructions
4. If listed but shows "Invalid":
   - Click on the domain
   - Click **"Refresh"** or **"Verify"**
   - Wait a few minutes and check again

### Step 5: Test Domain Resolution

After DNS propagates:

1. **Test root domain**:
   ```bash
   curl -I https://ispora.com
   ```
   Should return Vercel headers

2. **Test www subdomain**:
   ```bash
   curl -I https://www.ispora.com
   ```
   Should return Vercel headers

3. **Compare with Vercel URL**:
   - Visit `https://ispora-website.vercel.app/admin`
   - Visit `https://ispora.com/admin`
   - They should show **identical content** (same debug banners)

## Common Issues & Fixes

### Issue 1: DNS Records Correct but Still Invalid

**Solution**:
- Wait 15-30 minutes
- In Vercel Dashboard → Domains → Click "Refresh" on the domain
- Remove and re-add the domain in Vercel

### Issue 2: Domain Points to Wrong Project

**Solution**:
- Check if `ispora.com` is connected to multiple Vercel projects
- Remove it from all projects
- Add it only to `ispora-website` project

### Issue 3: DNS Propagation Delay

**Solution**:
- Use DNS checker tools to verify propagation globally
- Wait up to 48 hours for full propagation
- Check from different locations/networks

### Issue 4: Namecheap DNS Not Updating

**Solution**:
- In Namecheap → Domain → Advanced DNS
- Delete the records
- Wait 5 minutes
- Re-add the records exactly as Vercel specifies
- Save changes

## Expected Final State

When everything is working:

✅ **Vercel Dashboard**:
- `ispora.com` - Valid Configuration
- `www.ispora.com` - Valid Configuration

✅ **DNS Check**:
- `ispora.com` resolves to `216.198.79.1`
- `www.ispora.com` resolves to `cf09c2bad433f855.vercel-dns-017.com.`

✅ **Browser Test**:
- `https://ispora.com/admin` shows red debug banner
- `https://www.ispora.com/admin` shows red debug banner
- Both match `https://ispora-website.vercel.app/admin`

## Quick Fix Checklist

- [ ] DNS records in Namecheap match Vercel exactly
- [ ] Waited at least 15 minutes after DNS changes
- [ ] Clicked "Refresh" in Vercel domain settings
- [ ] Verified domain is assigned to correct Vercel project
- [ ] Checked DNS propagation with online tools
- [ ] Tested both `ispora.com` and `www.ispora.com` in browser

## If Still Not Working

1. **Remove domain from Vercel**:
   - Settings → Domains → Remove `ispora.com` and `www.ispora.com`

2. **Wait 5 minutes**

3. **Re-add domain in Vercel**:
   - Add `ispora.com` (Vercel will auto-add `www.ispora.com`)
   - Copy the exact DNS records Vercel shows

4. **Update Namecheap DNS**:
   - Delete old records
   - Add new records exactly as Vercel specifies
   - Save

5. **Wait 15-30 minutes** and verify again

