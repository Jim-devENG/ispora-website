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
    return res.status(400).json({ error: 'Join request ID is required' });
  }

  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch (err: any) {
    console.error('[API][JOIN_REQUESTS][ID] Supabase connection failed:', err);
    console.error('[API][JOIN_REQUESTS][ID] Error message:', err?.message);
    console.error('[API][JOIN_REQUESTS][ID] Stack trace:', err?.stack);
    return res.status(500).json({ 
      error: 'Internal server error',
      hint: 'Check server logs for [API][JOIN_REQUESTS][ID]'
    });
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('join_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Join request not found' });
        }
        console.error('[API][JOIN_REQUESTS][ID] Supabase query error:', error);
        throw error;
      }

      return res.status(200).json(data);
    }

    if (req.method === 'PATCH') {
      const body = req.body || {};
      
      // Check if join request exists
      const { data: existing } = await supabase
        .from('join_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (!existing) {
        return res.status(404).json({ error: 'Join request not found' });
      }

      // Prepare update data
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
      if (body.name !== undefined) updateData.name = body.name;
      if (body.email !== undefined) updateData.email = body.email;
      if (body.role !== undefined) updateData.role = body.role;
      if (body.message !== undefined) updateData.message = body.message;

      const { data, error } = await supabase
        .from('join_requests')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[API][JOIN_REQUESTS][ID] Supabase update error:', error);
        throw error;
      }

      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      // Check if join request exists
      const { data: existing } = await supabase
        .from('join_requests')
        .select('id')
        .eq('id', id)
        .single();

      if (!existing) {
        return res.status(404).json({ error: 'Join request not found' });
      }

      const { error } = await supabase
        .from('join_requests')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[API][JOIN_REQUESTS][ID] Supabase delete error:', error);
        throw error;
      }

      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('[API][JOIN_REQUESTS][ID] Failed to process request');
    console.error('[API][JOIN_REQUESTS][ID] Error message:', error?.message);
    console.error('[API][JOIN_REQUESTS][ID] Stack trace:', error?.stack);
    return res.status(500).json({ 
      error: 'Internal server error',
      hint: 'Check server logs for [API][JOIN_REQUESTS][ID]'
    });
  }
}

