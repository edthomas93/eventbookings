import { EmailService } from '../../../src/services/email';
import { ServerError } from '../../../src/errors/errors';

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn(),
    },
  })),
}));

describe('EmailService', () => {
  let emailService: EmailService;
  let mockSend: jest.Mock;

  beforeEach(() => {
    emailService = new EmailService();
    mockSend = (emailService as any).resend.emails.send;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('sendEmail should call Resend API with correct params', async () => {
    mockSend.mockResolvedValue(undefined); // no response body from 'resend' on success

    await emailService.sendEmail('test@example.com', 'Test Subject', '<p>Test Body</p>');

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith({
      from: process.env.SMTP_FROM || 'onboarding@resend.dev',
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test Body</p>',
    });
  });

  test('sendEmail should throw ServerError when Resend API fails', async () => {
    mockSend.mockRejectedValue(new Error('API failure'));

    await expect(emailService.sendEmail('test@example.com', 'Test Subject', '<p>Test Body</p>'))
      .rejects.toThrow(ServerError);

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith({
      from: process.env.SMTP_FROM || 'onboarding@resend.dev',
      to: 'test@example.com',
      subject: 'Test Subject',
      html: expect.stringContaining('Test Body'),
    });
  });

  test('sendConfirmationEmail should format the email correctly', async () => {
    mockSend.mockResolvedValue(undefined);

    await emailService.sendConfirmationEmail('test@example.com', 'test-token');

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith({
      from: process.env.SMTP_FROM || 'onboarding@resend.dev',
      to: 'test@example.com',
      subject: 'Confirm Your Email',
      html: expect.stringContaining('Confirm Your Email'),
    });
  });

  test('sendPasswordResetEmail should format the email correctly', async () => {
    mockSend.mockResolvedValue(undefined);

    await emailService.sendPasswordResetEmail('test@example.com', 'reset-token');

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith({
      from: process.env.SMTP_FROM || 'onboarding@resend.dev',
      to: 'test@example.com',
      subject: 'Reset Your Password',
      html: expect.stringContaining('Reset Your Password'),
    });
  });
});
