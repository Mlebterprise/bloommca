import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.215b570242754d44b55f1f2cbb7d35d7',
  appName: 'bloom-coach-connect',
  webDir: 'dist',
  server: {
    url: "https://215b5702-4275-4d44-b55f-1f2cbb7d35d7.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;