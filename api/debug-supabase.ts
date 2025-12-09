// API Route Pattern: api/*.ts files with export default async function handler
// This route implements /api/debug-supabase
// GET: Tests Supabase connection and returns status

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

  try {
    // Get Supabase client (will throw if env vars are missing)
    const supabase = getSupabaseClient();

    // Try a trivial query on registrations table
    const { data, error } = await supabase
      .from('registrations')
      .select('id')
      .limit(1);

    if (error) {
      console.error('[API][DEBUG_SUPABASE] Supabase query failed:', error);
      console.error('[API][DEBUG_SUPABASE] Error message:', error.message);
      console.error('[API][DEBUG_SUPABASE] Error code:', error.code);
      console.error('[API][DEBUG_SUPABASE] Error details:', error.details);
      console.error('[API][DEBUG_SUPABASE] Error hint:', error.hint);
      
      return res.status(500).json({
        ok: false,
        error: error.message || 'Supabase debug failed',
        code: error.code,
        details: error.details,
        hint: error.hint,
        timestamp: new Date().toISOString()
      });
    }

    // Success
    return res.status(200).json({
      ok: true,
      message: 'Supabase connection OK',
      timestamp: new Date().toISOString(),
      testQuery: {
        table: 'registrations',
        result: data ? 'Success' : 'No data (table may be empty)',
        rowCount: data?.length || 0
      }
    });
  } catch (error: any) {
    console.error('[API][DEBUG_SUPABASE] Failed to connect to Supabase');
    console.error('[API][DEBUG_SUPABASE] Error message:', error?.message);
    console.error('[API][DEBUG_SUPABASE] Stack trace:', error?.stack);
    
    return res.status(500).json({
      ok: false,
      error: error?.message || 'Supabase debug failed',
      timestamp: new Date().toISOString()
    });
  }
}

