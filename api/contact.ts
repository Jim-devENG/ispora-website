import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from './_lib/supabase.js';
import { checkRateLimit, getClientIP, sanitizeObject, validateRequired, isValidEmail, sanitizeString } from './_lib/security.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  // Check if this is a request for a specific contact (by ID query parameter)
  const { id } = req.query;
  const isIdRequest = id && typeof id === 'string';

  // Handle ID-specific requests (PATCH, DELETE) - using query parameter instead of path
  if (isIdRequest && (req.method === 'PATCH' || req.method === 'DELETE')) {
    try {
      if (req.method === 'PATCH') {
        const body = req.body || {};
        
        // Validate status if provided
        if (body.status && !['new', 'read', 'replied', 'archived'].includes(body.status)) {
          return res.status(400).json({ error: 'Invalid status value' });
        }

        const updateData: any = {};
        if (body.status) updateData.status = body.status;

        const { data, error } = await supabase
          .from('contact_submissions')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('[API][CONTACT] Update error:', error);
          throw error;
        }

        if (!data) {
          return res.status(404).json({ error: 'Contact submission not found' });
        }

        return res.status(200).json(data);
      }

      if (req.method === 'DELETE') {
        const { error } = await supabase
          .from('contact_submissions')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('[API][CONTACT] Delete error:', error);
          throw error;
        }

        return res.status(204).end();
      }
    } catch (error: any) {
      console.error('[API][CONTACT] Error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        details: error?.message,
        hint: 'Check server logs for [API][CONTACT]'
      });
    }
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
    console.error('[API][CONTACT] Supabase connection failed:', err);
    return res.status(500).json({ 
      error: 'Internal server error',
      hint: 'Check server logs for [API][CONTACT]'
    });
  }

  try {
    if (req.method === 'POST') {
      // Sanitize input
      const body = sanitizeObject(req.body || {});
      
      // Validate required fields
      const validation = validateRequired(body, ['name', 'email', 'message']);
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
      
      // Get IP address and user agent
      const ipAddress = body.ipAddress || clientIP;
      const userAgent = body.userAgent || req.headers['user-agent'] || null;
      
      // Prepare data for Supabase
      const contactData = {
        name: sanitizeString(body.name, 200),
        email: sanitizeString(body.email, 255).toLowerCase(),
        role: body.role ? sanitizeString(body.role, 100) : null,
        message: sanitizeString(body.message, 5000),
        status: 'new',
        ip_address: ipAddress,
        user_agent: userAgent ? sanitizeString(userAgent, 500) : null,
      };

      console.log('[API][CONTACT] Inserting contact submission');
      
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert(contactData)
        .select()
        .single();

      if (error) {
        console.error('[API][CONTACT] Supabase insert error:', error);
        throw error;
      }

      console.log('[API][CONTACT] Contact submission created successfully:', data.id);
      return res.status(201).json(data);
    }

    if (req.method === 'GET') {
      const { status } = req.query;
      
      let query = supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[API][CONTACT] Supabase query error:', error);
        throw error;
      }
      
      return res.status(200).json(data || []);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('[API][CONTACT] Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error?.message,
      hint: 'Check server logs for [API][CONTACT]'
    });
  }
}

