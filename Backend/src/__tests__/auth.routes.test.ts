import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../app';
import * as authService from '../services/auth.service';
import { REFRESH_TOKEN_COOKIE } from '../utils/cookie';

vi.mock('../services/auth.service');
vi.mock('../services/email.service');

const TEST_SECRET = process.env.JWT_SECRET!;

const mockUser = {
  id: 1,
  email: 'user@example.com',
  name: 'Test User',
  role: 'TRAINEE' as const,
  aiCredits: 2,
  avatarUrl: null,
  experienceLevel: null,
};

describe('Auth routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('returns 200 with OTP sent message', async () => {
      vi.mocked(authService.requestRegister).mockResolvedValue({
        message: 'OTP sent to email',
        expiresIn: 300,
      });

      const app = createApp();
      const res = await request(app).post('/auth/register').send({
        email: 'user@example.com',
        password: 'SecurePass1',
        name: 'Test User',
        role: 'TRAINEE',
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: 'OTP sent to email',
        expiresIn: 300,
      });
      expect(res.headers['set-cookie']).toBeUndefined();
    });

    it('returns 409 when email already exists', async () => {
      const { AppError } = await import('../utils/app-error');
      vi.mocked(authService.requestRegister).mockRejectedValue(
        new AppError(409, 'Email already exists'),
      );

      const app = createApp();
      const res = await request(app).post('/auth/register').send({
        email: 'user@example.com',
        password: 'SecurePass1',
        role: 'TRAINEE',
      });

      expect(res.status).toBe(409);
      expect(res.body).toEqual({ error: 'Email already exists' });
    });

    it('returns 400 for invalid body', async () => {
      const app = createApp();
      const res = await request(app).post('/auth/register').send({
        email: 'not-an-email',
        password: 'short',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('returns 400 when role is not TRAINEE or TRAINER', async () => {
      const app = createApp();
      const res = await request(app).post('/auth/register').send({
        email: 'user@example.com',
        password: 'SecurePass1',
        role: 'ADMIN',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('accepts lowercase trainer role on register', async () => {
      vi.mocked(authService.requestRegister).mockResolvedValue({
        message: 'OTP sent to email',
        expiresIn: 300,
      });

      const app = createApp();
      const res = await request(app).post('/auth/register').send({
        email: 'trainer@example.com',
        password: 'SecurePass1',
        role: 'trainer',
      });

      expect(res.status).toBe(200);
      expect(authService.requestRegister).toHaveBeenCalledWith({
        email: 'trainer@example.com',
        password: 'SecurePass1',
        role: 'TRAINER',
      });
    });

    it('returns 400 when role is missing', async () => {
      const app = createApp();
      const res = await request(app).post('/auth/register').send({
        email: 'user@example.com',
        password: 'SecurePass1',
        name: 'Test User',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('returns 400 when otp is sent instead of role', async () => {
      const app = createApp();
      const res = await request(app).post('/auth/register').send({
        email: 'user@example.com',
        password: 'SecurePass1',
        name: 'Test User',
        otp: 'TRAINER',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });
  });

  describe('POST /auth/register/verify', () => {
    it('returns 201 with accessToken and sets refresh cookie', async () => {
      vi.mocked(authService.verifyRegister).mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: mockUser,
      });

      const app = createApp();
      const res = await request(app).post('/auth/register/verify').send({
        email: 'user@example.com',
        otp: '123456',
      });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        accessToken: 'access-token',
        user: mockUser,
      });
      expect(res.headers['set-cookie']?.[0]).toContain(`${REFRESH_TOKEN_COOKIE}=refresh-token`);
    });

    it('returns 401 for invalid OTP', async () => {
      const { AppError } = await import('../utils/app-error');
      vi.mocked(authService.verifyRegister).mockRejectedValue(new AppError(401, 'Invalid OTP'));

      const app = createApp();
      const res = await request(app).post('/auth/register/verify').send({
        email: 'user@example.com',
        otp: '000000',
      });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Invalid OTP' });
    });

    it('returns 400 for invalid OTP format', async () => {
      const app = createApp();
      const res = await request(app).post('/auth/register/verify').send({
        email: 'user@example.com',
        otp: 'abc',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('passes optional lowercase trainer role to verify service', async () => {
      vi.mocked(authService.verifyRegister).mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: { ...mockUser, role: 'TRAINER' },
      });

      const app = createApp();
      const res = await request(app).post('/auth/register/verify').send({
        email: 'trainer@example.com',
        otp: '123456',
        role: 'trainer',
      });

      expect(res.status).toBe(201);
      expect(authService.verifyRegister).toHaveBeenCalledWith({
        email: 'trainer@example.com',
        otp: '123456',
        role: 'TRAINER',
      });
    });
  });

  describe('POST /auth/register/resend-otp', () => {
    it('returns 200 when OTP is resent', async () => {
      vi.mocked(authService.resendRegisterOtp).mockResolvedValue({
        message: 'OTP sent to email',
        expiresIn: 300,
      });

      const app = createApp();
      const res = await request(app).post('/auth/register/resend-otp').send({
        email: 'user@example.com',
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: 'OTP sent to email',
        expiresIn: 300,
      });
      expect(authService.resendRegisterOtp).toHaveBeenCalledWith('user@example.com');
    });
  });

  describe('POST /auth/change-password', () => {
    it('returns 401 when Authorization header is missing', async () => {
      const app = createApp();
      const res = await request(app).post('/auth/change-password').send({
        currentPassword: 'OldPass1',
        newPassword: 'NewPass2',
      });

      expect(res.status).toBe(401);
    });

    it('returns 401 when current password is incorrect', async () => {
      const { AppError } = await import('../utils/app-error');
      vi.mocked(authService.changePassword).mockRejectedValue(
        new AppError(401, 'Current password is incorrect'),
      );

      const token = jwt.sign({ userId: 1, role: 'TRAINEE' }, TEST_SECRET, { expiresIn: '1h' });
      const app = createApp();
      const res = await request(app)
        .post('/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'WrongPass1',
          newPassword: 'NewPass2',
        });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Current password is incorrect' });
    });

    it('returns 200 when password is changed successfully', async () => {
      vi.mocked(authService.changePassword).mockResolvedValue({
        message: 'Password changed successfully',
      });

      const token = jwt.sign({ userId: 1, role: 'TRAINEE' }, TEST_SECRET, { expiresIn: '1h' });
      const app = createApp();
      const res = await request(app)
        .post('/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'OldPass1',
          newPassword: 'NewPass2',
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Password changed successfully' });
      expect(authService.changePassword).toHaveBeenCalledWith(1, {
        currentPassword: 'OldPass1',
        newPassword: 'NewPass2',
      });
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('returns 200 with generic message', async () => {
      vi.mocked(authService.requestForgotPassword).mockResolvedValue({
        message: 'If the email exists, an OTP has been sent',
        expiresIn: 300,
      });

      const app = createApp();
      const res = await request(app).post('/auth/forgot-password').send({
        email: 'user@example.com',
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: 'If the email exists, an OTP has been sent',
        expiresIn: 300,
      });
    });
  });

  describe('POST /auth/forgot-password/verify', () => {
    it('returns 200 when password is reset successfully', async () => {
      vi.mocked(authService.verifyForgotPassword).mockResolvedValue({
        message: 'Password reset successfully',
      });

      const app = createApp();
      const res = await request(app).post('/auth/forgot-password/verify').send({
        email: 'user@example.com',
        otp: '123456',
        newPassword: 'NewPass1',
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Password reset successfully' });
    });

    it('returns 401 for invalid OTP', async () => {
      const { AppError } = await import('../utils/app-error');
      vi.mocked(authService.verifyForgotPassword).mockRejectedValue(new AppError(401, 'Invalid OTP'));

      const app = createApp();
      const res = await request(app).post('/auth/forgot-password/verify').send({
        email: 'user@example.com',
        otp: '000000',
        newPassword: 'NewPass1',
      });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Invalid OTP' });
    });
  });

  describe('POST /auth/forgot-password/resend-otp', () => {
    it('returns 200 when OTP is resent', async () => {
      vi.mocked(authService.resendForgotPasswordOtp).mockResolvedValue({
        message: 'If the email exists, an OTP has been sent',
        expiresIn: 300,
      });

      const app = createApp();
      const res = await request(app).post('/auth/forgot-password/resend-otp').send({
        email: 'user@example.com',
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: 'If the email exists, an OTP has been sent',
        expiresIn: 300,
      });
      expect(authService.resendForgotPasswordOtp).toHaveBeenCalledWith('user@example.com');
    });
  });

  describe('POST /auth/login', () => {
    it('returns 200 with accessToken on success', async () => {
      vi.mocked(authService.login).mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: mockUser,
      });

      const app = createApp();
      const res = await request(app).post('/auth/login').send({
        email: 'user@example.com',
        password: 'SecurePass1',
      });

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBe('access-token');
    });

    it('returns 401 for invalid credentials', async () => {
      const { AppError } = await import('../utils/app-error');
      vi.mocked(authService.login).mockRejectedValue(
        new AppError(401, 'Invalid email or password'),
      );

      const app = createApp();
      const res = await request(app).post('/auth/login').send({
        email: 'user@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Invalid email or password' });
    });
  });

  describe('POST /auth/refresh', () => {
    it('returns 200 with new accessToken when cookie is valid', async () => {
      vi.mocked(authService.refresh).mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      const app = createApp();
      const res = await request(app)
        .post('/auth/refresh')
        .set('Cookie', `${REFRESH_TOKEN_COOKIE}=valid-refresh-token`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ accessToken: 'new-access-token' });
      expect(res.headers['set-cookie']?.[0]).toContain(`${REFRESH_TOKEN_COOKIE}=new-refresh-token`);
    });

    it('returns 401 when refresh cookie is missing', async () => {
      const app = createApp();
      const res = await request(app).post('/auth/refresh');

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Missing refresh token' });
      expect(authService.refresh).not.toHaveBeenCalled();
    });
  });

  describe('GET /auth/me', () => {
    it('returns 401 when Authorization header is missing', async () => {
      const app = createApp();
      const res = await request(app).get('/auth/me');

      expect(res.status).toBe(401);
    });

    it('returns 200 with user profile when token is valid', async () => {
      vi.mocked(authService.getMe).mockResolvedValue(mockUser);

      const token = jwt.sign({ userId: 1, role: 'TRAINEE' }, TEST_SECRET, { expiresIn: '1h' });
      const app = createApp();
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
      expect(authService.getMe).toHaveBeenCalledWith(1);
    });
  });

  describe('PATCH /auth/me', () => {
    it('returns 401 when Authorization header is missing', async () => {
      const app = createApp();
      const res = await request(app).patch('/auth/me').send({ name: 'Updated Name' });

      expect(res.status).toBe(401);
    });

    it('returns 400 when body is empty', async () => {
      const token = jwt.sign({ userId: 1, role: 'TRAINEE' }, TEST_SECRET, { expiresIn: '1h' });
      const app = createApp();
      const res = await request(app)
        .patch('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('returns 200 with updated user profile when token is valid', async () => {
      const updatedUser = {
        ...mockUser,
        name: 'Updated Name',
        experienceLevel: 'BEGINNER' as const,
      };
      vi.mocked(authService.updateProfile).mockResolvedValue(updatedUser);

      const token = jwt.sign({ userId: 1, role: 'TRAINEE' }, TEST_SECRET, { expiresIn: '1h' });
      const app = createApp();
      const res = await request(app)
        .patch('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name', experienceLevel: 'BEGINNER' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updatedUser);
      expect(authService.updateProfile).toHaveBeenCalledWith(1, {
        name: 'Updated Name',
        experienceLevel: 'BEGINNER',
      });
    });
  });
});
