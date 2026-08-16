/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Absolute URL of the hosted AI backend (e.g. https://api.yourapp.com). Leave
  // unset for local web dev, where relative /api/* paths hit the same-origin
  // Express server. Required once the app is packaged with Capacitor, since a
  // native WebView has no same-origin server to fall back to.
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
