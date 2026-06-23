import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../app';
import * as userService from '../services/user.service';

vi.mock('../services/user.service');

const TEST_SECRET = process.env.JWT_SECRET!;

const mockUsers = [
  {
    id: 1,
    email: 'admin@gmail.com',
    name: 'Admin',
    role: 'ADMIN' as const,
    aiCredits: 2,
    avatarUrl: null,
    experienceLevel: null,
    createdAt: '2026-06-01T00:00:00.000Z',
  },
  {
    id: 2,
    email: 'user@example.com',
    name: 'Test User',
    role: 'TRAINEE' as const,
    aiCredits: 5,
    avatarUrl: null,
    experienceLevel: null,
    createdAt: '2026-06-02T00:00:00.000Z',
  },
];

const authHeader = (role: string) => {
  const token = jwt.sign({ userId: 1, role }, TEST_SECRET, { expiresIn: '1h' });
  return { Authorization: `Bearer ${token}` };
};

describe('User routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /users', () => {
    it('returns 401 when not authenticated', async () => {
      const app = createApp();
      const res = await request(app).get('/users');

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Missing or invalid authorization header' });
    });

    it('returns 403 for non-admin roles', async () => {
      const app = createApp();

      const traineeRes = await request(app)
        .get('/users')
        .set(authHeader('TRAINEE'));

      expect(traineeRes.status).toBe(403);
      expect(traineeRes.body).toEqual({ error: 'Bạn không có quyền thực hiện thao tác này' });

      const trainerRes = await request(app)
        .get('/users')
        .set(authHeader('TRAINER'));

      expect(trainerRes.status).toBe(403);
    });

    it('returns 200 with all users for admin', async () => {
      vi.mocked(userService.getAllUsers).mockResolvedValue(mockUsers);

      const app = createApp();
      const res = await request(app)
        .get('/users')
        .set(authHeader('ADMIN'));

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUsers);
      expect(userService.getAllUsers).toHaveBeenCalledOnce();
    });
  });
});
