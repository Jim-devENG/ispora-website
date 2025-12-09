import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient, transformRegistration } from '../_lib/supabase.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (_req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch (err: any) {
    console.error('[API][DASHBOARD_STATS] Supabase connection failed:', err);
    console.error('[API][DASHBOARD_STATS] Error message:', err?.message);
    console.error('[API][DASHBOARD_STATS] Stack trace:', err?.stack);
    return res.status(500).json({ 
      error: 'Internal server error',
      hint: 'Check server logs for [API][DASHBOARD_STATS]'
    });
  }

  try {
    console.log('Stats API: Computing basic statistics...');
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    console.log('Stats API: Running count queries...');
    
    // Get all counts in parallel
    const [totalResult, dailyResult, weeklyResult, monthlyResult, recentResult] = await Promise.all([
      supabase.from('registrations').select('id', { count: 'exact', head: true }),
      supabase.from('registrations').select('id', { count: 'exact', head: true }).gte('created_at', oneDayAgo),
      supabase.from('registrations').select('id', { count: 'exact', head: true }).gte('created_at', oneWeekAgo),
      supabase.from('registrations').select('id', { count: 'exact', head: true }).gte('created_at', oneMonthAgo),
      supabase.from('registrations').select('*').order('created_at', { ascending: false }).limit(10),
    ]);

    const total = totalResult.count || 0;
    const daily = dailyResult.count || 0;
    const weekly = weeklyResult.count || 0;
    const monthly = monthlyResult.count || 0;
    const recentActivity = (recentResult.data || []).map(transformRegistration);

    console.log('Stats API: Basic stats computed:', { total, daily, weekly, monthly });

    console.log('Stats API: Computing top countries...');
    // Get all registrations to compute top countries
    const { data: allRegistrations } = await supabase
      .from('registrations')
      .select('country_of_residence');

    const countryCounts: { [key: string]: number } = {};
    (allRegistrations || []).forEach((reg: any) => {
      const country = reg.country_of_residence || 'Unknown';
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    const topCountries = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    console.log('Stats API: Top countries computed:', topCountries);

    // Map to expected format
    const result = {
      totalRegistrations: total,
      todayRegistrations: daily,
      thisWeekRegistrations: weekly,
      thisMonthRegistrations: monthly,
      topCountries,
      recentActivity
    };

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('[API][DASHBOARD_STATS] Failed to load stats');
    console.error('[API][DASHBOARD_STATS] Error message:', error?.message);
    console.error('[API][DASHBOARD_STATS] Stack trace:', error?.stack);
    return res.status(500).json({ 
      error: 'Internal server error',
      hint: 'Check server logs for [API][DASHBOARD_STATS]'
    });
  }
}


