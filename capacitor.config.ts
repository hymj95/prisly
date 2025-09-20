import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.fb613642c0bc434293d27193d2fe37da',
  appName: 'prisly',
  webDir: 'dist',
  server: {
    url: 'https://fb613642-c0bc-4342-93d2-7193d2fe37da.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera']
    },
    BarcodeScanning: {
      permissions: ['camera']
    }
  }
};

export default config;