/**
 * Frontend security utilities
 * - Disable console logs in production
 * - Obfuscate sensitive data
 */

// Disable console logs in production
if (import.meta.env.PROD) {
  const noop = () => {};
  
  // Override console methods
  console.log = noop;
  console.debug = noop;
  console.info = noop;
  console.warn = noop;
  // Keep console.error for critical errors, but sanitize
  const originalError = console.error;
  console.error = (...args: any[]) => {
    // Only log in development
    if (import.meta.env.DEV) {
      originalError(...args);
    }
  };
}

// Prevent access to sensitive objects in dev tools
if (import.meta.env.PROD) {
  // Make it harder to access environment variables
  Object.defineProperty(window, '__ENV__', {
    get: () => undefined,
    configurable: false,
    enumerable: false
  });
}

// Sanitize user input
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .substring(0, maxLength);
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

// Validate URL
export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

