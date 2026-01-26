/**
 * Website Visit Tracking Utility
 * Tracks all page visits with location data
 */

interface VisitData {
  page: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  location?: {
    country?: string;
    city?: string;
    region?: string;
    timezone?: string;
    latitude?: number;
    longitude?: number;
  };
}

function resolveApiBaseUrl(): string {
  const envBase = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  if (typeof window === 'undefined') return envBase || '';
  const origin = window.location.origin;
  // Force same-origin when on production domain to avoid CORS
  if (origin.includes('ispora.com')) return `${origin}/api`;
  // If env var exists but points to a different origin, prefer same-origin
  try {
    if (envBase) {
      const envOrigin = new URL(envBase).origin;
      if (envOrigin !== origin) return `${origin}/api`;
    }
  } catch {}
  return envBase || `${origin}/api`;
}

const API_BASE_URL = resolveApiBaseUrl();

/**
 * Track a page visit
 */
export async function trackVisit(page: string): Promise<void> {
  try {
    // Get current page info
    const referrer = document.referrer || undefined;
    const userAgent = navigator.userAgent || undefined;
    
    // Get IP address and location data
    let ipAddress: string | undefined;
    let locationData: VisitData['location'] | undefined;

    try {
      // Get IP address
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      ipAddress = ipData.ip;

      // Get location data from IP
      if (ipAddress) {
        const locationResponse = await fetch(`https://ipapi.co/${ipAddress}/json/`);
        const locationJson = await locationResponse.json();
        
        locationData = {
          country: locationJson.country_name || undefined,
          city: locationJson.city || undefined,
          region: locationJson.region || undefined,
          timezone: locationJson.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || undefined,
          latitude: locationJson.latitude || undefined,
          longitude: locationJson.longitude || undefined,
        };
      }
    } catch (error) {
      console.warn('[VisitTracker] Could not fetch location data:', error);
      // Fallback to browser timezone
      locationData = {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || undefined,
      };
    }

    // Prepare visit data (match API format)
    const visitData = {
      page,
      referrer,
      userAgent,
      ipAddress,
      location: locationData,
      country: locationData?.country,
      city: locationData?.city,
      region: locationData?.region,
      timezone: locationData?.timezone,
    };

    // Send to API (fire and forget - don't block the page)
    fetch(`${API_BASE_URL}/visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visitData),
    }).catch((error) => {
      // Silently fail - visit tracking is non-critical
      console.warn('[VisitTracker] Failed to log visit:', error);
    });
  } catch (error) {
    // Silently fail - visit tracking should not break the app
    console.warn('[VisitTracker] Error tracking visit:', error);
  }
}

/**
 * Track page visit with debouncing (only track once per page per session)
 */
const trackedPages = new Set<string>();

export function trackPageVisit(page: string): void {
  // Create a unique key for this page visit in this session
  const sessionKey = `${page}-${Date.now()}`;
  
  // Only track if we haven't tracked this page recently (within 5 seconds)
  const recentKey = `${page}-recent`;
  if (trackedPages.has(recentKey)) {
    return;
  }
  
  trackedPages.add(recentKey);
  
  // Clear the recent flag after 5 seconds
  setTimeout(() => {
    trackedPages.delete(recentKey);
  }, 5000);
  
  // Track the visit
  trackVisit(page);
}

