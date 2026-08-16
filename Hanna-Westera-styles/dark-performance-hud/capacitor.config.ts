import type { CapacitorConfig } from '@capacitor/cli';

// appId: reverse-domain identifier for the app — this is what iOS/Android use to
// identify your app in their stores. Change this before you actually submit
// (it must be unique and, once published, can never change again).
const config: CapacitorConfig = {
  appId: 'com.hannawestera.glutex',
  appName: 'Glutex',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
