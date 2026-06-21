import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware';

const TEST_SECRET = 'test-secret-key-that-is-at-least-32-characters-long';

const mockRes = () => {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  } as unknown as Response;
  (res.status as ReturnType<typeof vi.fn>).mockReturnValue(res);
  return res;
};

describe('authMiddleware', () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
  });

  it('returns 401 when Authorization header is missing', () => {
    const req = { headers: {} } as AuthRequest;
    const res = mockRes();
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is invalid', () => {
    const req = { headers: { authorization: 'Bearer invalid-token' } } as AuthRequest;
    const res = mockRes();
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('calls next and attaches userId when token is valid', () => {
    const token = jwt.sign({ userId: 42, role: 'TRAINEE' }, TEST_SECRET, { expiresIn: '1h' });
    const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;
    const res = mockRes();
    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.userId).toBe(42);
    expect(req.userRole).toBe('TRAINEE');
  });
});
