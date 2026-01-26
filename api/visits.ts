import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from './_lib/supabase.js';
import { getClientIP, sanitizeObject, sanitizeString } from './_lib/security.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch (err: any) {
    console.error('[API][VISITS] Supabase connection failed:', err);
    return res.status(500).json({ 
      error: 'Internal server error',
      hint: 'Check server logs for [API][VISITS]'
    });
  }

  try {
    if (req.method === 'POST') {
      // Get client IP from request
      const clientIP = getClientIP(req);
      
      // Sanitize input
      const body = sanitizeObject(req.body || {});
      
      // Prepare visit data
      const visitData = {
        ip_address: clientIP || body.ipAddress || null,
        page: body.page ? sanitizeString(body.page, 200) : null,
        referrer: body.referrer ? sanitizeString(body.referrer, 500) : null,
        user_agent: body.userAgent ? sanitizeString(body.userAgent, 500) : null,
        location: body.location || null,
        country: body.country ? sanitizeString(body.country, 100) : null,
        city: body.city ? sanitizeString(body.city, 100) : null,
        region: body.region ? sanitizeString(body.region, 100) : null,
        timezone: body.timezone ? sanitizeString(body.timezone, 50) : null,
      };

      console.log('[API][VISITS] Logging visit:', JSON.stringify(visitData, null, 2));
      
      const { data, error } = await supabase
        .from('visits')
        .insert(visitData)
        .select()
        .single();

      if (error) {
        console.error('[API][VISITS] Insert error:', error);
        // Don't throw - visits are non-critical, just log the error
        return res.status(200).json({ 
          success: false,
          message: 'Visit logged (with errors)',
          error: error.message 
        });
      }

      console.log('[API][VISITS] Visit logged successfully:', data.id);
      return res.status(201).json({ 
        success: true,
        id: data.id 
      });
    }

    if (req.method === 'GET') {
      // Get visit statistics or list visits (for admin)
      const { stats, limit = '100' } = req.query;
      
      if (stats === 'true') {
        // Get visit statistics
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

        const [totalResult, dailyResult, weeklyResult, monthlyResult, topCountriesResult, topPagesResult] = await Promise.all([
          supabase.from('visits').select('*', { count: 'exact', head: true }),
          supabase.from('visits').select('*', { count: 'exact', head: true }).gte('created_at', oneDayAgo),
          supabase.from('visits').select('*', { count: 'exact', head: true }).gte('created_at', oneWeekAgo),
          supabase.from('visits').select('*', { count: 'exact', head: true }).gte('created_at', oneMonthAgo),
          supabase.from('visits').select('country').gte('created_at', oneMonthAgo),
          supabase.from('visits').select('page').gte('created_at', oneMonthAgo),
        ]);

        // Calculate top countries
        const countryCounts: { [key: string]: number } = {};
        (topCountriesResult.data || []).forEach((visit: any) => {
          const country = visit.country || 'Unknown';
          countryCounts[country] = (countryCounts[country] || 0) + 1;
        });

        const topCountries = Object.entries(countryCounts)
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        // Calculate top pages
        const pageCounts: { [key: string]: number } = {};
        (topPagesResult.data || []).forEach((visit: any) => {
          const page = visit.page || 'Unknown';
          pageCounts[page] = (pageCounts[page] || 0) + 1;
        });

        const topPages = Object.entries(pageCounts)
          .map(([page, count]) => ({ page, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        return res.status(200).json({
          total: totalResult.count || 0,
          daily: dailyResult.count || 0,
          weekly: weeklyResult.count || 0,
          monthly: monthlyResult.count || 0,
          topCountries,
          topPages
        });
      }

      // Get recent visits
      const limitNum = parseInt(limit as string, 10) || 100;
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limitNum);

      if (error) {
        console.error('[API][VISITS] Query error:', error);
        throw error;
      }

      return res.status(200).json({ visits: data || [] });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('[API][VISITS] Error:', error?.message);
    console.error('[API][VISITS] Stack trace:', error?.stack);
    return res.status(500).json({ 
      error: 'Internal server error',
      hint: 'Check server logs for [API][VISITS]'
    });
  }
}

