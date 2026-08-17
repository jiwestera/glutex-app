/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Absolute URL of the hosted AI backend (e.g. https://api.yourapp.com). Leave
  // unset for local web dev, where relative /api/* paths hit the same-origin
  // Express server. Required once the app is packaged with Capacitor, since a
  // native WebView has no same-origin server to fall back to.
  readonly VITE_API_BASE_URL?: string;

  // Firebase web app config, from Project Settings > General > Your apps in the
  // Firebase console. All optional -- leaving them unset disables cross-device
  // sync entirely and the app runs fully local, same as before this feature.
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
