// Empty string keeps requests relative (same-origin Express server in dev/web).
// Set VITE_API_BASE_URL to the hosted backend's absolute URL when building the
// Capacitor app — a native WebView has no same-origin server to hit.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
