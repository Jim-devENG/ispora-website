/**
 * Frontend Supabase Client
 * 
 * Uses the anonymous/public key for client-side operations.
 * This is safe to expose in the frontend as it's restricted by RLS policies.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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
  
  // Throw error to prevent silent failures
  if (import.meta.env.PROD) {
    throw new Error('Missing Supabase environment variables. See console for setup instructions.');
  }
}

// Use actual values or throw in production
// Never expose service role keys or sensitive data in frontend
if (import.meta.env.PROD && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
  throw new Error('Missing required environment variables');
}

export const supabase = createClient(
  SUPABASE_URL || '',
  SUPABASE_ANON_KEY || '',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

