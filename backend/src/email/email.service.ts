import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter!: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const user = this.configService.get<string>('GMAIL_USER');
    const pass = this.configService.get<string>('GMAIL_APP_PASSWORD');

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user,
          pass,
        },
      });
    } else {
      this.logger.warn('Gmail credentials not found. Email service is disabled.');
    }
  }

  async sendOrderConfirmation(order: any, user: any) {
    if (!this.transporter) return;

    try {
      await this.transporter.sendMail({
        from: `"ClothHive" <${this.configService.get('GMAIL_USER')}>`,
        to: user.email,
        subject: `Order Confirmation #${order.id}`,
        html: `
          <h1>Thank you for your order!</h1>
          <p>Hi ${user.name || 'Customer'},</p>
          <p>We've received your order and are getting it ready for shipment.</p>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Total Amount:</strong> $${order.totalAmount}</p>
          <p><strong>Payment Method:</strong> Cash on Delivery</p>
          <p>We will notify you when it ships.</p>
        `,
      });
      this.logger.log(`Order confirmation email sent to ${user.email}`);
    } catch (err: unknown) {
      const error = err as Error;
      this.logger.error(`Failed to send order confirmation: ${error.message}`);
    }
  }

  async sendOrderStatusUpdate(order: any, user: any, newStatus: string) {
    if (!this.transporter) return;

    try {
      await this.transporter.sendMail({
        from: `"ClothHive" <${this.configService.get('GMAIL_USER')}>`,
        to: user.email,
        subject: `Order Update #${order.id} - ${newStatus}`,
        html: `
          <h1>Your order status has been updated</h1>
          <p>Hi ${user.name || 'Customer'},</p>
          <p>Your order #${order.id} is now: <strong>${newStatus}</strong></p>
          ${order.trackingNumber ? `<p>Tracking Number: ${order.trackingNumber}</p>` : ''}
          ${order.trackingUrl ? `<p><a href="${order.trackingUrl}">Track Package</a></p>` : ''}
        `,
      });
      this.logger.log(`Status update email sent to ${user.email}`);
    } catch (err: unknown) {
      const error = err as Error;
      this.logger.error(`Failed to send status update: ${error.message}`);
    }
  }

  async sendWelcomeEmail(user: any) {
    if (!this.transporter) return;

    try {
      await this.transporter.sendMail({
        from: `"ClothHive" <${this.configService.get('GMAIL_USER')}>`,
        to: user.email,
        subject: 'Welcome to ClothHive!',
        html: `
          <h1>Welcome to ClothHive!</h1>
          <p>Hi ${user.name || 'there'},</p>
          <p>Thanks for joining us. We're excited to have you on board!</p>
          <p>Start exploring our latest collections today.</p>
        `,
      });
      this.logger.log(`Welcome email sent to ${user.email}`);
    } catch (err: unknown) {
      const error = err as Error;
      this.logger.error(`Failed to send welcome email: ${error.message}`);
    }
  }
}
