import { vi } from 'vitest';

vi.mock('swagger-ui-express', () => ({
  default: {
    serve: [],
    setup: () => (_req: unknown, _res: unknown, next: () => void) => next(),
  },
}));

vi.mock('swagger-jsdoc', () => ({
  default: () => ({}),
}));
