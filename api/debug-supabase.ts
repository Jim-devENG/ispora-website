// API Route Pattern: api/*.ts files with export default async function handler
// Debug endpoint: /api/debug-supabase
// GET: Tests Supabase connection and returns diagnostic information

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Check environment variables
  const hasSupabaseUrl = !!(process.env.SUPABASE_URL && process.env.SUPABASE_URL.trim() !== '');
  const hasServiceRoleKey = !!(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY.trim() !== '');
  
  const response: any = {
    ok: hasSupabaseUrl && hasServiceRoleKey,
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV || 'unknown',
      vercelEnv: process.env.VERCEL_ENV || 'unknown',
    },
    envVars: {
      SUPABASE_URL: {
        present: hasSupabaseUrl,
        value: hasSupabaseUrl ? `${process.env.SUPABASE_URL?.substring(0, 30)}...` : 'MISSING',
      },
      SUPABASE_SERVICE_ROLE_KEY: {
        present: hasServiceRoleKey,
        value: hasServiceRoleKey ? `${process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 30)}...` : 'MISSING',
      },
    },
  };

  // Try to test Supabase connection if env vars are present
  if (hasSupabaseUrl && hasServiceRoleKey) {
    try {
      const { getSupabaseClient } = await import('./_lib/supabase.js');
      const supabaseClient = getSupabaseClient();
      
      // Test query
      const { data, error } = await supabaseClient
        .from('registrations')
        .select('id')
        .limit(1);

      if (error) {
        response.supabase = {
          connected: false,
          error: error.message || 'Supabase query failed',
          code: error.code,
          details: error.details,
          hint: error.hint,
        };
        response.ok = false;
      } else {
        response.supabase = {
          connected: true,
          message: 'Supabase connection OK',
          testQuery: {
            table: 'registrations',
            result: 'Success',
            rowCount: data?.length || 0,
          },
        };
      }
    } catch (error: any) {
      response.supabase = {
        connected: false,
        error: error?.message || 'Failed to initialize Supabase client',
        stack: error?.stack,
      };
      response.ok = false;
    }
  } else {
    response.supabase = {
      connected: false,
      error: 'Cannot test connection: missing environment variables',
    };
    response.instructions = {
      step1: 'Go to Vercel Dashboard → Your Project → Settings → Environment Variables',
      step2: 'Add SUPABASE_URL (your Supabase project URL)',
      step3: 'Add SUPABASE_SERVICE_ROLE_KEY (your Supabase service role key)',
      step4: 'Redeploy your application',
      documentation: 'See scripts/SUPABASE_ENV.md for detailed instructions',
    };
  }

  return res.status(200).json(response);
}

