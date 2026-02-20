/**
 * Security utilities for API routes
 * - Input validation
 * - Rate limiting (basic)
 * - Request sanitization
 */

import type { VercelRequest } from '@vercel/node';

// Simple in-memory rate limiting (for basic protection)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute per IP

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count };
}

// Get client IP address
export function getClientIP(req: VercelRequest): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    (req.headers['x-real-ip'] as string) ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

// Sanitize string input
export function sanitizeString(input: any, maxLength: number = 1000): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters
  let sanitized = input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, maxLength);
  
  return sanitized;
}

// Sanitize rich-text HTML input
// - Preserves HTML tags for editors like Quill
// - Removes script tags, inline event handlers, and javascript: URLs
export function sanitizeRichTextHtml(input: any, maxLength: number = 10000): string {
  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = input.trim().substring(0, maxLength);

  // Remove script blocks
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove inline event handlers like onclick=...
  sanitized = sanitized.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // Remove javascript: protocol in href/src
  sanitized = sanitized.replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*("|')/gi, '$1=$2#$3');
  sanitized = sanitized.replace(/(href|src)\s*=\s*javascript:[^\s>]*/gi, '$1=#');

  return sanitized;
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

// Validate URL format
export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// Sanitize object recursively
export function sanitizeObject(obj: any, maxDepth: number = 5): any {
  if (maxDepth <= 0) return {};
  
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeString(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, maxDepth - 1));
  }

  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = sanitizeString(key, 100);
    sanitized[sanitizedKey] = sanitizeObject(value, maxDepth - 1);
  }

  return sanitized;
}

// Validate required fields
export function validateRequired(data: any, fields: string[]): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  for (const field of fields) {
    if (!data || data[field] === undefined || data[field] === null || data[field] === '') {
      missing.push(field);
    }
  }

  return {
    valid: missing.length === 0,
    missing
  };
}

