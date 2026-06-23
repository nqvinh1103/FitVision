import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_APP_PASSWORD,
  },
});

export const sendOtpEmail = async (to: string, otp: string): Promise<void> => {
  if (env.NODE_ENV === 'test') {
    return;
  }

  const expiresMinutes = env.OTP_EXPIRES_IN.replace('m', '');

  await transporter.sendMail({
    from: `"FitVision" <${env.EMAIL_USER}>`,
    to,
    subject: 'FitVision - Mã xác thực đăng ký',
    text: `Mã OTP của bạn là: ${otp}\n\nMã có hiệu lực trong ${expiresMinutes} phút. Không chia sẻ mã này với bất kỳ ai.`,
    html: `
      <p>Mã OTP của bạn là: <strong>${otp}</strong></p>
      <p>Mã có hiệu lực trong <strong>${expiresMinutes} phút</strong>.</p>
      <p>Không chia sẻ mã này với bất kỳ ai.</p>
    `,
  });
};
