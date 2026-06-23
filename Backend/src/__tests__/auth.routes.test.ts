import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../app';
import * as authService from '../services/auth.service';
import { REFRESH_TOKEN_COOKIE } from '../utils/cookie';

vi.mock('../services/auth.service');

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
    it('returns 201 with accessToken and sets refresh cookie', async () => {
      vi.mocked(authService.register).mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: mockUser,
      });

      const app = createApp();
      const res = await request(app).post('/auth/register').send({
        email: 'user@example.com',
        password: 'SecurePass1',
        name: 'Test User',
      });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        accessToken: 'access-token',
        user: mockUser,
      });
      expect(res.headers['set-cookie']?.[0]).toContain(`${REFRESH_TOKEN_COOKIE}=refresh-token`);
    });

    it('returns 409 when email already exists', async () => {
      const { AppError } = await import('../utils/app-error');
      vi.mocked(authService.register).mockRejectedValue(new AppError(409, 'Email already exists'));

      const app = createApp();
      const res = await request(app).post('/auth/register').send({
        email: 'user@example.com',
        password: 'SecurePass1',
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
