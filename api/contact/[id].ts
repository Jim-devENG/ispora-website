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
    return res.status(400).json({ error: 'Contact ID is required' });
  }

  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch (err: any) {
    console.error('[API][CONTACT_ID] Supabase connection failed:', err);
    return res.status(500).json({ 
      error: 'Internal server error',
      hint: 'Check server logs for [API][CONTACT_ID]'
    });
  }

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
        console.error('[API][CONTACT_ID] Update error:', error);
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
        console.error('[API][CONTACT_ID] Delete error:', error);
        throw error;
      }

      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('[API][CONTACT_ID] Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error?.message,
      hint: 'Check server logs for [API][CONTACT_ID]'
    });
  }
}

