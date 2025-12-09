// API Route Pattern: api/*.ts files with export default async function handler
// This route implements /api/blog-posts
// GET: Returns { posts: BlogPost[] }
// POST: Accepts { title, slug, content, ... } and returns { post: BlogPost }

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from './_lib/supabase.js';
import type { BlogPost } from './_types/content.js';
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
    console.error('[API][BLOG_POSTS] Supabase connection failed:', err);
    console.error('[API][BLOG_POSTS] Error message:', err?.message);
    console.error('[API][BLOG_POSTS] Stack trace:', err?.stack);
    return res.status(500).json({ 
      error: 'Internal server error',
      hint: 'Check server logs for [API][BLOG_POSTS]'
    });
  }

  try {
    if (req.method === 'GET') {
      const { status, limit } = req.query;
      
      let query = supabase
        .from('blog_posts')
        .select('*');

      // Filter by status (default: 'published' if not provided)
      if (status && typeof status === 'string' && ['draft', 'published', 'archived'].includes(status)) {
        query = query.eq('status', status);
      } else if (status !== 'all') {
        // Default: only published posts
        query = query.eq('status', 'published');
      }

      // Sort by published_at desc, then created_at desc
      query = query
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      // Apply limit
      const limitNum = limit ? parseInt(limit as string, 10) : 20;
      if (limitNum > 0 && limitNum <= 100) {
        query = query.limit(limitNum);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[API][BLOG_POSTS] Supabase query error:', error);
        throw error;
      }

      return res.status(200).json({ posts: (data || []) as BlogPost[] });
    }

    if (req.method === 'POST') {
      // Sanitize input
      const body = sanitizeObject(req.body || {});
      
      // Validate required fields
      const validation = validateRequired(body, ['title', 'slug', 'content']);
      if (!validation.valid) {
        return res.status(400).json({ 
          error: 'Missing required fields: title, slug, and content are required',
          missing: validation.missing
        });
      }

      // Validate cover_image_url if provided
      if (body.cover_image_url && !isValidURL(body.cover_image_url)) {
        return res.status(400).json({ 
          error: 'Invalid cover_image_url format' 
        });
      }

      // Prepare post data (sanitize all string fields)
      const postData: Partial<BlogPost> = {
        title: sanitizeString(body.title, 500),
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt || null,
        tags: Array.isArray(body.tags) ? body.tags : (body.tags ? [body.tags] : []),
        status: body.status || 'draft',
        cover_image_url: body.cover_image_url || null,
        author_name: body.author_name || null,
        published_at: null,
      };

      // If status is 'published' and published_at is missing, set it to now
      if (postData.status === 'published' && !body.published_at) {
        postData.published_at = new Date().toISOString();
      } else if (body.published_at) {
        postData.published_at = body.published_at;
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .insert(postData)
        .select()
        .single();

      if (error) {
        console.error('[API][BLOG_POSTS] Supabase insert error:', error);
        
        // Handle unique constraint violation (duplicate slug)
        if (error.code === '23505') {
          return res.status(400).json({ 
            error: 'A blog post with this slug already exists',
            details: error.message
          });
        }
        
        throw error;
      }

      return res.status(201).json({ post: data as BlogPost });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('[API][BLOG_POSTS] Failed to load blog posts');
    console.error('[API][BLOG_POSTS] Error message:', error?.message);
    console.error('[API][BLOG_POSTS] Stack trace:', error?.stack);
    return res.status(500).json({ 
      error: 'Internal server error',
      hint: 'Check server logs for [API][BLOG_POSTS]'
    });
  }
}
