import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from '../_lib/supabase.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Partner ID is required' });
  }

  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch (err: any) {
    console.error('[API][PARTNERS][ID] Supabase connection failed:', err);
    console.error('[API][PARTNERS][ID] Error message:', err?.message);
    console.error('[API][PARTNERS][ID] Stack trace:', err?.stack);
    return res.status(500).json({ 
      error: 'Internal server error',
      hint: 'Check server logs for [API][PARTNERS][ID]'
    });
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('partner_submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Partner not found' });
        }
        console.error('[API][PARTNERS][ID] Supabase query error:', error);
        throw error;
      }

      return res.status(200).json(data);
    }

    if (req.method === 'PATCH') {
      const body = req.body || {};
      
      // Check if partner exists
      const { data: existing } = await supabase
        .from('partner_submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (!existing) {
        return res.status(404).json({ error: 'Partner not found' });
      }

      // Prepare update data (only allow status updates from admin)
      const updateData: any = {};
      if (body.status !== undefined) {
        if (!['pending', 'approved', 'rejected'].includes(body.status)) {
          return res.status(400).json({ 
            error: 'Invalid status. Must be pending, approved, or rejected' 
          });
        }
        updateData.status = body.status;
      }

      // Allow other fields to be updated
      const allowedFields = [
        'full_name', 'email', 'phone', 'country', 'linkedin', 'org_name',
        'org_type', 'role', 'org_website', 'org_social_media', 'partnership_focus',
        'other_focus', 'about_work', 'why_partner', 'how_contribute', 'what_expect',
        'additional_notes'
      ];

      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updateData[field] = body[field];
        }
      }

      const { data, error } = await supabase
        .from('partner_submissions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[API][PARTNERS][ID] Supabase update error:', error);
        throw error;
      }

      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      // Check if partner exists
      const { data: existing } = await supabase
        .from('partner_submissions')
        .select('id')
        .eq('id', id)
        .single();

      if (!existing) {
        return res.status(404).json({ error: 'Partner not found' });
      }

      const { error } = await supabase
        .from('partner_submissions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[API][PARTNERS][ID] Supabase delete error:', error);
        throw error;
      }

      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('[API][PARTNERS][ID] Failed to process request');
    console.error('[API][PARTNERS][ID] Error message:', error?.message);
    console.error('[API][PARTNERS][ID] Stack trace:', error?.stack);
    return res.status(500).json({ 
      error: 'Internal server error',
      hint: 'Check server logs for [API][PARTNERS][ID]'
    });
  }
}

