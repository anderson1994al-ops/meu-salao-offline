import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.af5a2ef28d984de69da8f102f3f51e17',
  appName: 'meu-salao-offline',
  webDir: 'dist',
  server: {
    url: 'https://af5a2ef2-8d98-4de6-9da8-f102f3f51e17.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;
