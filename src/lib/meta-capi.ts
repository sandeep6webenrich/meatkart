import { createHash } from 'crypto';

const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const API_VERSION = 'v19.0';

export type UserData = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  clientIp?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
};

export type EventData = {
  eventName: string;
  eventTime?: number;
  eventId?: string;
  eventSourceUrl?: string;
  actionSource?: 'website' | 'email' | 'app';
  userData: UserData;
  customData?: Record<string, any>;
};

function hashData(data: string): string {
  return createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
}

export async function sendMetaEvent(event: EventData) {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn('Meta Pixel ID or Access Token is missing');
    return;
  }

  const userData = {
    em: event.userData.email ? hashData(event.userData.email) : undefined,
    ph: event.userData.phone ? hashData(event.userData.phone) : undefined,
    fn: event.userData.firstName ? hashData(event.userData.firstName) : undefined,
    ln: event.userData.lastName ? hashData(event.userData.lastName) : undefined,
    ct: event.userData.city ? hashData(event.userData.city) : undefined,
    st: event.userData.state ? hashData(event.userData.state) : undefined,
    zp: event.userData.zip ? hashData(event.userData.zip) : undefined,
    country: event.userData.country ? hashData(event.userData.country) : undefined,
    client_ip_address: event.userData.clientIp,
    client_user_agent: event.userData.userAgent,
    fbc: event.userData.fbc,
    fbp: event.userData.fbp,
  };

  const payload = {
    data: [
      {
        event_name: event.eventName,
        event_time: event.eventTime || Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        event_source_url: event.eventSourceUrl,
        action_source: event.actionSource || 'website',
        user_data: userData,
        custom_data: event.customData,
      },
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      console.error('Meta CAPI Error:', data);
    }
  } catch (error) {
    console.error('Meta CAPI Network Error:', error);
  }
}
