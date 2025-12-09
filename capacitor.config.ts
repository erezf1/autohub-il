import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.fb4341bdb60743c28ee5aba167a5f06d',
  appName: 'autohub-il',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  },
  server: {
    url: "https://fb4341bd-b607-43c2-8ee5-aba167a5f06d.lovableproject.com?forceHideBadge=true",
    cleartext: true
  }
};

export default config;
