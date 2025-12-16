/**
 * Frontend Supabase Client
 * 
 * Uses the anonymous/public key for client-side operations.
 * This is safe to expose in the frontend as it's restricted by RLS policies.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log clear setup instructions if env vars are missing
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  const errorMsg = `
[Supabase] Missing environment variables!

Required for image uploads:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

To fix:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add VITE_SUPABASE_URL = https://cjpzxwqeonxddilqxilw.supabase.co
3. Add VITE_SUPABASE_ANON_KEY = (your anon key from Supabase Dashboard)
4. Redeploy your project

See VERCEL_ENV_SETUP.md for detailed instructions.
  `;
  console.error(errorMsg);
}

// In production, fail fast if env vars are not set
if (import.meta.env.PROD && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
  throw new Error('Missing Supabase environment variables. See console for setup instructions.');
}

let supabaseClient: ReturnType<typeof createClient>;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  // Normal case: env vars configured
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
} else {
  // Dev-only safeguard: create a proxy that throws a clear error when used,
  // instead of crashing at import-time with "supabaseUrl is required".
  supabaseClient = new Proxy({} as any, {
    get() {
      throw new Error(
        '[Supabase] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured. ' +
          'Image uploads are disabled until you add these env vars (see VERCEL_ENV_SETUP.md).'
      );
    },
  });
}

export const supabase = supabaseClient;

