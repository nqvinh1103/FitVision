import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import { login } from '../services/auth.service';
import { prisma } from '../lib/prisma';

vi.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    registrationOtp: {
      findUnique: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
    },
  },
}));

vi.mock('../services/email.service', () => ({
  sendOtpEmail: vi.fn(),
}));

describe('auth.service login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when user does not exist and no pending registration', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.registrationOtp.findUnique).mockResolvedValue(null);

    await expect(
      login({ email: 'user@example.com', password: 'SecurePass1' }),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: 'Invalid email or password',
    });
  });

  it('returns 403 when pending registration exists with matching password', async () => {
    const passwordHash = await bcrypt.hash('SecurePass1', 12);

    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.registrationOtp.findUnique).mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      otpHash: 'hash',
      passwordHash,
      role: 'TRAINEE',
      name: 'Test User',
      attempts: 0,
      expiresAt: new Date(Date.now() + 60_000),
      lastSentAt: new Date(),
      createdAt: new Date(),
    });

    await expect(
      login({ email: 'user@example.com', password: 'SecurePass1' }),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: 'Email chưa được xác thực. Vui lòng nhập mã OTP đã gửi về email của bạn.',
    });
  });

  it('returns 401 when pending registration exists with wrong password', async () => {
    const passwordHash = await bcrypt.hash('SecurePass1', 12);

    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.registrationOtp.findUnique).mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      otpHash: 'hash',
      passwordHash,
      role: 'TRAINEE',
      name: 'Test User',
      attempts: 0,
      expiresAt: new Date(Date.now() + 60_000),
      lastSentAt: new Date(),
      createdAt: new Date(),
    });

    await expect(
      login({ email: 'user@example.com', password: 'WrongPassword1' }),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: 'Invalid email or password',
    });
  });
});
