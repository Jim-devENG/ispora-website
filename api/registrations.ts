import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient, transformRegistration } from './_lib/supabase.js';
import { checkRateLimit, getClientIP, sanitizeObject, validateRequired, isValidEmail, sanitizeString } from './_lib/security.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  // Rate limiting
  const clientIP = getClientIP(req);
  const rateLimit = checkRateLimit(clientIP);
  if (!rateLimit.allowed) {
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.',
      retryAfter: 60
    });
  }

  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch (err: any) {
    console.error('[API][REGISTRATIONS] Supabase connection failed:', err);
    console.error('[API][REGISTRATIONS] Error message:', err?.message);
    console.error('[API][REGISTRATIONS] Stack trace:', err?.stack);
    return res.status(500).json({ 
      error: 'Internal server error',
      hint: 'Check server logs for [API][REGISTRATIONS]'
    });
  }

  try {
    if (req.method === 'POST') {
      // Sanitize input
      const body = sanitizeObject(req.body || {});
      
      // Validate required fields
      const validation = validateRequired(body, ['name', 'email', 'whatsapp', 'countryOfResidence']);
      if (!validation.valid) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          missing: validation.missing
        });
      }

      // Validate email format
      if (!isValidEmail(body.email)) {
        return res.status(400).json({ 
          error: 'Invalid email format' 
        });
      }
      
      // Normalize group value
      const groupType = (body.group === 'local' || body.group === 'diaspora') ? body.group : 'diaspora';
      
      // Prepare data for Supabase (sanitize all string fields)
      const registrationData = {
        name: sanitizeString(body.name, 200),
        email: sanitizeString(body.email, 255).toLowerCase(),
        whatsapp: sanitizeString(body.whatsapp, 50),
        country_of_origin: body.countryOfOrigin ? sanitizeString(body.countryOfOrigin, 100) : sanitizeString(body.countryOfResidence, 100), // Use residence as fallback
        country_of_residence: sanitizeString(body.countryOfResidence, 100),
        group_type: groupType,
        ip_address: body.ipAddress || null,
        location: body.location || null,
        status: body.status || 'pending',
        user_agent: body.userAgent ? sanitizeString(body.userAgent, 500) : null,
      };

      console.log('Normalized registration data:', JSON.stringify(registrationData, null, 2));
      
      const { data, error } = await supabase
        .from('registrations')
        .insert(registrationData)
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Registration created successfully:', data.id);
      return res.status(201).json(transformRegistration(data));
    }

    if (req.method === 'GET') {
      // Check if stats are requested
      if (req.query.stats === 'true') {
        console.log('Stats API: Computing basic statistics...');
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

        console.log('Stats API: Running count queries...');
        
        // Get all counts in parallel
        const [totalResult, dailyResult, weeklyResult, monthlyResult, recentResult] = await Promise.all([
          supabase.from('registrations').select('*', { count: 'exact', head: true }),
          supabase.from('registrations').select('*', { count: 'exact', head: true }).gte('created_at', oneDayAgo),
          supabase.from('registrations').select('*', { count: 'exact', head: true }).gte('created_at', oneWeekAgo),
          supabase.from('registrations').select('*', { count: 'exact', head: true }).gte('created_at', oneMonthAgo),
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

        // Also get visit statistics in parallel
        let visitStats = null;
        try {
          const now = new Date();
          const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
          const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

          const [visitTotalResult, visitDailyResult, visitWeeklyResult, visitMonthlyResult, visitTopCountriesResult, visitTopPagesResult] = await Promise.all([
            supabase.from('visits').select('*', { count: 'exact', head: true }),
            supabase.from('visits').select('*', { count: 'exact', head: true }).gte('created_at', oneDayAgo),
            supabase.from('visits').select('*', { count: 'exact', head: true }).gte('created_at', oneWeekAgo),
            supabase.from('visits').select('*', { count: 'exact', head: true }).gte('created_at', oneMonthAgo),
            supabase.from('visits').select('country').gte('created_at', oneMonthAgo),
            supabase.from('visits').select('page').gte('created_at', oneMonthAgo),
          ]);

          const visitCountryCounts: { [key: string]: number } = {};
          (visitTopCountriesResult.data || []).forEach((visit: any) => {
            const country = visit.country || 'Unknown';
            visitCountryCounts[country] = (visitCountryCounts[country] || 0) + 1;
          });

          const visitTopCountries = Object.entries(visitCountryCounts)
            .map(([country, count]) => ({ country, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

          const visitPageCounts: { [key: string]: number } = {};
          (visitTopPagesResult.data || []).forEach((visit: any) => {
            const page = visit.page || 'Unknown';
            visitPageCounts[page] = (visitPageCounts[page] || 0) + 1;
          });

          const visitTopPages = Object.entries(visitPageCounts)
            .map(([page, count]) => ({ page, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

          visitStats = {
            total: visitTotalResult.count || 0,
            daily: visitDailyResult.count || 0,
            weekly: visitWeeklyResult.count || 0,
            monthly: visitMonthlyResult.count || 0,
            topCountries: visitTopCountries,
            topPages: visitTopPages
          };
        } catch (err) {
          console.warn('[API][REGISTRATIONS] Failed to load visit stats:', err);
          // Continue without visit stats
        }

        // Map to expected format
        const result: any = {
          totalRegistrations: total,
          todayRegistrations: daily,
          thisWeekRegistrations: weekly,
          thisMonthRegistrations: monthly,
          topCountries,
          recentActivity
        };

        // Add visit stats if available
        if (visitStats) {
          result.visitStats = visitStats;
        }

        return res.status(200).json(result);
      }

      console.log('Fetching registrations...');
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      const registrations = data?.map(transformRegistration) || [];
      return res.status(200).json({ registrations });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('[API][REGISTRATIONS] Failed to load registrations');
    console.error('[API][REGISTRATIONS] Error message:', error?.message);
    console.error('[API][REGISTRATIONS] Stack trace:', error?.stack);
    return res.status(500).json({ 
      error: 'Internal server error',
      hint: 'Check server logs for [API][REGISTRATIONS]'
    });
  }
}


