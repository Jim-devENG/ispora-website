// API Route Pattern: api/*.ts files with export default async function handler
// Combined debug endpoint: /api/debug
// GET: Returns deployment info and optionally tests Supabase connection
// Query param ?supabase=true to test Supabase connection

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from './_lib/supabase.js';

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

  const { supabase } = req.query;
  const testSupabase = supabase === 'true';

  // Always return deployment info
  const response: any = {
    ok: true,
    route: '/api/debug',
    timestamp: new Date().toISOString(),
    commitHint: 'admin-rebuild-debug-v1',
    buildInfo: {
      nodeEnv: process.env.NODE_ENV || 'unknown',
      vercelEnv: process.env.VERCEL_ENV || 'unknown',
      deploymentDate: new Date().toISOString().split('T')[0]
    }
  };

  // Optionally test Supabase connection
  if (testSupabase) {
    try {
      const supabaseClient = getSupabaseClient();
      const { data, error } = await supabaseClient
        .from('registrations')
        .select('id')
        .limit(1);

      if (error) {
        response.supabase = {
          ok: false,
          error: error.message || 'Supabase query failed',
          code: error.code,
          details: error.details,
          hint: error.hint
        };
      } else {
        response.supabase = {
          ok: true,
          message: 'Supabase connection OK',
          testQuery: {
            table: 'registrations',
            result: data ? 'Success' : 'No data (table may be empty)',
            rowCount: data?.length || 0
          }
        };
      }
    } catch (error: any) {
      response.supabase = {
        ok: false,
        error: error?.message || 'Supabase connection failed',
        timestamp: new Date().toISOString()
      };
    }
  }

  return res.status(200).json(response);
}

