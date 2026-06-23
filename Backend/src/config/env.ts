import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000').transform(Number),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  HMAC_SECRET: z.string().min(16),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  EMAIL_USER: z.string().email(),
  EMAIL_APP_PASSWORD: z.string().min(1),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.string().default('587').transform(Number),
  SMTP_SECURE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
  OTP_EXPIRES_IN: z.string().default('5m'),
  OTP_RESEND_COOLDOWN_SECONDS: z.string().default('60').transform(Number),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
