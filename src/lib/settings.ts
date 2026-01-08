import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

export const defaultSettings = {
  payment: {
    provider: 'stripe',
    publishableKey: '',
    secretKey: '',
    merchantId: '',
  },
  shipping: {
    provider: 'nimbuspost',
    email: '',
    password: '',
    apiKey: '',
  },
  email: {
    host: '',
    port: 587,
    user: '',
    password: '',
    fromAddress: '',
  },
  analytics: {
    googleAnalyticsId: '',
    facebookPixelId: '',
  },
};

export async function getSettings() {
  try {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
    
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    
    // Deep merge with default settings to ensure all fields exist
    return {
      ...defaultSettings,
      ...parsed,
      payment: { ...defaultSettings.payment, ...parsed.payment },
      shipping: { ...defaultSettings.shipping, ...parsed.shipping },
      email: { ...defaultSettings.email, ...parsed.email },
      analytics: { ...defaultSettings.analytics, ...parsed.analytics },
    };
  } catch (error) {
    return defaultSettings;
  }
}

export async function saveSettings(settings: any) {
  try {
    await fs.access(DATA_DIR).catch(() => fs.mkdir(DATA_DIR, { recursive: true }));
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return false;
  }
}
