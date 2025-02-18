import { Resend } from 'resend';
import { ServerError } from '../errors/errors';

export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY || 'your-api-key');
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      await this.resend.emails.send({
        from: process.env.SMTP_FROM || 'onboarding@resend.dev',
        to,
        subject,
        html,
      });

      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new ServerError('Failed to send email');
    }
  }

  async sendConfirmationEmail(email: string, token: string) {
    const confirmationUrl = `${process.env.APP_URL}/auth/confirm-email?token=${token}`;
    const html = `
      <h1>Confirm Your Email</h1>
      <p>Click the link below to verify your account:</p>
      <a href="${confirmationUrl}">Confirm Email</a>
    `;

    await this.sendEmail(email, 'Confirm Your Email', html);
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `${process.env.APP_URL}/auth/reset-password?token=${resetToken}`;
    const html = `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
    `;

    await this.sendEmail(email, 'Reset Your Password', html);
  }
}