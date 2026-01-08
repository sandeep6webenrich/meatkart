import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { NotificationType } from '@prisma/client';

// Configure Nodemailer transporter
// Ensure you have these environment variables set in .env:
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const notificationService = {
  /**
   * Send an email using Nodemailer
   */
  async sendEmail(to: string, subject: string, html: string) {
    console.log(`[Email Service] Sending email to ${to}`);
    try {
      if (!process.env.SMTP_HOST) {
        console.warn('SMTP_HOST not set. Email simulation:', { to, subject });
        return { success: true, simulated: true };
      }

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || '"United Herbal" <no-reply@unitedherbal.com>',
        to,
        subject,
        html,
      });
      console.log('Email sent: %s', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }
  },

  /**
   * Send SMS (Placeholder for Twilio/Gupshup)
   */
  async sendSMS(to: string, message: string) {
    console.log(`[SMS Service] Sending SMS to ${to}: ${message}`);
    // TODO: Integrate Twilio or Gupshup here
    // Example Twilio:
    // await client.messages.create({ body: message, from: '+1234567890', to });
    return { success: true, simulated: true };
  },

  /**
   * Create an internal alert for Admins (stored in DB for polling)
   */
  async createAdminAlert(type: NotificationType, data: any, orderId?: string) {
    try {
      const notification = await prisma.notification.create({
        data: {
          type,
          recipient: 'admin',
          status: 'unread',
          notificationData: data,
          orderId,
        },
      });
      return { success: true, notification };
    } catch (error) {
      console.error('Error creating admin alert:', error);
      return { success: false, error };
    }
  },

  /**
   * Orchestrate notifications for a new order
   */
  async notifyOrderCreated(order: any) {
    const customerInfo = order.customerInfo as any;
    const email = order.user?.email || customerInfo?.email;
    const phone = order.user?.phone || customerInfo?.phone;

    // 1. Admin Alert
    await this.createAdminAlert('order_created', {
      orderNumber: order.orderNumber,
      amount: Number(order.totalAmount),
      customerName: customerInfo?.firstName ? `${customerInfo.firstName} ${customerInfo.lastName}` : 'Guest',
    }, order.id);

    // 2. Email Customer
    if (email) {
      const emailContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Order Confirmation</h1>
          <p>Hi ${customerInfo?.firstName || 'Valued Customer'},</p>
          <p>Thank you for your order! We have received your order <strong>#${order.orderNumber}</strong>.</p>
          <p>Total Amount: <strong>Rs. ${Number(order.totalAmount).toFixed(2)}</strong></p>
          <p>We will notify you once it ships.</p>
        </div>
      `;
      await this.sendEmail(email, `Order Confirmation #${order.orderNumber}`, emailContent);
    }

    // 3. SMS Customer
    if (phone) {
      const smsMessage = `United Herbal: Thanks for your order #${order.orderNumber} of Rs. ${Number(order.totalAmount)}. We will update you on shipping.`;
      await this.sendSMS(phone, smsMessage);
    }
  }
};
