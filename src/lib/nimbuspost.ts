import { prisma } from './prisma';
import { getSettings } from './settings';

interface NimbusConfig {
  email: string;
  password: string;
}

interface ShipmentDetails {
  orderNumber: string;
  paymentMethod: string;
  totalAmount: number;
  weight: number; // in grams
  length: number;
  breadth: number;
  height: number;
  consignee: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email?: string;
  };
  items: Array<{
    name: string;
    qty: number;
    price: number;
    sku?: string;
  }>;
}

class NimbusPostService {
  private baseUrl = 'https://api.nimbuspost.com/v1';
  private token: string | null = null;

  private async login() {
    const settings = await getSettings();
    
    // Prioritize settings file, fallback to env vars
    const email = settings.shipping.provider === 'nimbuspost' && settings.shipping.email 
      ? settings.shipping.email 
      : process.env.NIMBUSPOST_EMAIL;
      
    const password = settings.shipping.provider === 'nimbuspost' && settings.shipping.password 
      ? settings.shipping.password 
      : process.env.NIMBUSPOST_PASSWORD;

    if (!email || !password) {
      throw new Error('NimbusPost credentials not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!data.status || !data.data) {
        throw new Error(data.message || 'Login failed');
      }

      this.token = data.data;
      return this.token;
    } catch (error) {
      console.error('NimbusPost Login Error:', error);
      throw error;
    }
  }

  private async getHeaders() {
    if (!this.token) {
      await this.login();
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    };
  }

  async createShipment(shipmentDetails: ShipmentDetails) {
    try {
      const headers = await this.getHeaders();
      
      // Map local shipment details to NimbusPost payload
      // Note: This payload structure is based on standard courier API patterns.
      // You may need to adjust fields based on specific NimbusPost API docs.
      const payload = {
        order_number: shipmentDetails.orderNumber,
        payment_type: shipmentDetails.paymentMethod === 'cod' ? 'cod' : 'prepaid',
        package_weight: shipmentDetails.weight,
        package_length: shipmentDetails.length,
        package_breadth: shipmentDetails.breadth,
        package_height: shipmentDetails.height,
        order_amount: shipmentDetails.totalAmount,
        consignee: {
          name: shipmentDetails.consignee.name,
          address: shipmentDetails.consignee.address,
          city: shipmentDetails.consignee.city,
          state: shipmentDetails.consignee.state,
          pincode: shipmentDetails.consignee.pincode,
          phone: shipmentDetails.consignee.phone,
          email: shipmentDetails.consignee.email,
        },
        pickup_warehouse: 'Primary', // Default or Configurable
        order_items: shipmentDetails.items.map(item => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          sku: item.sku || 'N/A'
        }))
      };

      const response = await fetch(`${this.baseUrl}/shipments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.status) {
        throw new Error(data.message || 'Failed to create shipment');
      }

      return {
        success: true,
        awb: data.data.awb_number,
        courierId: data.data.courier_id,
        courierName: data.data.courier_name,
        labelUrl: data.data.label_url,
        manifestUrl: data.data.manifest_url,
        shipmentId: data.data.shipment_id
      };

    } catch (error) {
      console.error('Create Shipment Error:', error);
      return { success: false, error };
    }
  }

  async trackShipment(awb: string) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/shipments/track/${awb}`, {
        method: 'GET',
        headers,
      });
      const data = await response.json();
      return data.data; // Return tracking info
    } catch (error) {
      console.error('Track Shipment Error:', error);
      return null;
    }
  }
}

export const nimbusPostService = new NimbusPostService();
