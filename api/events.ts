// API Route Pattern: api/*.ts files with export default async function handler
// This route implements /api/events
// GET: Returns { events: Event[] }
// POST: Accepts { title, start_at, ... } and returns { event: Event }

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from './_lib/supabase.js';
import type { Event } from './_types/content.js';
import { checkRateLimit, getClientIP, sanitizeObject, validateRequired, sanitizeString, isValidURL } from './_lib/security.js';

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
    console.error('[API][EVENTS] Supabase connection failed:', err);
    console.error('[API][EVENTS] Error message:', err?.message);
    console.error('[API][EVENTS] Stack trace:', err?.stack);
    return res.status(500).json({ 
      error: 'Internal server error',
      hint: 'Check server logs for [API][EVENTS]'
    });
  }

  try {
    if (req.method === 'GET') {
      const { status, upcoming, limit } = req.query;
      
      let query = supabase
        .from('events')
        .select('*');

      // Filter by status (default: 'published' if not provided)
      if (status && typeof status === 'string' && ['draft', 'published', 'archived'].includes(status)) {
        query = query.eq('status', status);
      } else if (status !== 'all') {
        // Default: only published events
        query = query.eq('status', 'published');
      }

      // Filter by upcoming (only events with start_at >= now)
      const upcomingFilter = upcoming === 'true' || (upcoming === undefined && status !== 'all');
      if (upcomingFilter) {
        const now = new Date().toISOString();
        query = query.gte('start_at', now);
      }

      // Sort by start_at ascending
      query = query.order('start_at', { ascending: true });

      // Apply limit
      const limitNum = limit ? parseInt(limit as string, 10) : 20;
      if (limitNum > 0 && limitNum <= 100) {
        query = query.limit(limitNum);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[API][EVENTS] Supabase query error:', error);
        throw error;
      }

      return res.status(200).json({ events: (data || []) as Event[] });
    }

    if (req.method === 'POST') {
      // Sanitize input
      const body = sanitizeObject(req.body || {});
      
      // Validate required fields
      const validation = validateRequired(body, ['title', 'start_at']);
      if (!validation.valid) {
        return res.status(400).json({ 
          error: 'Missing required fields: title and start_at are required',
          missing: validation.missing
        });
      }

      // Validate start_at is a valid date
      const startAt = new Date(body.start_at);
      if (isNaN(startAt.getTime())) {
        return res.status(400).json({ 
          error: 'Invalid start_at date format' 
        });
      }

      // Validate URLs if provided
      if (body.cover_image_url && !isValidURL(body.cover_image_url)) {
        return res.status(400).json({ 
          error: 'Invalid cover_image_url format' 
        });
      }
      if (body.registration_link && !isValidURL(body.registration_link)) {
        return res.status(400).json({ 
          error: 'Invalid registration_link format' 
        });
      }

      // Prepare event data (sanitize all string fields)
      const eventData: Partial<Event> = {
        title: sanitizeString(body.title, 500),
        description: body.description || null,
        start_at: startAt.toISOString(),
        end_at: body.end_at ? new Date(body.end_at).toISOString() : null,
        location: body.location || null,
        registration_link: body.registration_link || null,
        status: body.status || 'draft',
        cover_image_url: body.cover_image_url || null,
      };

      // Validate end_at if provided
      if (eventData.end_at) {
        const endAt = new Date(eventData.end_at);
        if (isNaN(endAt.getTime()) || endAt < startAt) {
          return res.status(400).json({ 
            error: 'Invalid end_at date: must be after start_at' 
          });
        }
      }

      console.log('[API][EVENTS] Inserting event with data:', JSON.stringify({ ...eventData, description: eventData.description ? '[truncated]' : null }));

      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();

      if (error) {
        console.error('[API][EVENTS] Supabase insert error:', error);
        console.error('[API][EVENTS] Error code:', error.code);
        console.error('[API][EVENTS] Error message:', error.message);
        console.error('[API][EVENTS] Error details:', error.details);
        console.error('[API][EVENTS] Error hint:', error.hint);
        return res.status(500).json({ 
          error: 'Failed to create event',
          details: error.message,
          code: error.code,
          hint: error.hint || 'Check database schema and constraints'
        });
      }

      console.log('[API][EVENTS] Event created successfully:', data?.id);
      return res.status(201).json({ event: data as Event });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('[API][EVENTS] Unexpected error:', error);
    console.error('[API][EVENTS] Error message:', error?.message);
    console.error('[API][EVENTS] Error code:', error?.code);
    console.error('[API][EVENTS] Error details:', error?.details);
    console.error('[API][EVENTS] Stack trace:', error?.stack);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error?.message || 'Unknown error',
      code: error?.code,
      hint: 'Check server logs for [API][EVENTS]'
    });
  }
}
