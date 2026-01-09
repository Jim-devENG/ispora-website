import { createClient } from '@supabase/supabase-js';

// Strict environment variable validation
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables synchronously
function validateEnvVars() {
  const missing: string[] = [];
  
  if (!SUPABASE_URL || SUPABASE_URL.trim() === '') {
    missing.push('SUPABASE_URL');
  }
  
  if (!SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY.trim() === '') {
    missing.push('SUPABASE_SERVICE_ROLE_KEY');
  }
  
  if (missing.length > 0) {
    const errorMsg = `Missing required environment variable(s): ${missing.join(', ')}. ` +
      `Please configure these in Vercel Dashboard → Settings → Environment Variables. ` +
      `Check scripts/SUPABASE_ENV.md for setup instructions.`;
    console.error('[SUPABASE_CLIENT] Validation failed:', errorMsg);
    throw new Error(errorMsg);
  }
}

// Create Supabase client with service role key (for admin operations)
export function getSupabaseClient() {
  // Validate env vars before creating client
  validateEnvVars();

  return createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Database types matching our schema
export interface RegistrationRow {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  country_of_origin: string;
  country_of_residence: string;
  group_type: 'local' | 'diaspora';
  ip_address: string | null;
  location: {
    city?: string;
    country?: string;
    timezone?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  } | null;
  status: 'pending' | 'active' | 'verified';
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

// Transform Supabase row to API format
export function transformRegistration(row: RegistrationRow) {
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    email: row.email,
    whatsapp: row.whatsapp,
    countryOfOrigin: row.country_of_origin,
    countryOfResidence: row.country_of_residence,
    group: row.group_type,
    ipAddress: row.ip_address || undefined,
    location: row.location || {},
    status: row.status,
    userAgent: row.user_agent || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    timestamp: row.created_at, // For compatibility
  };
}

