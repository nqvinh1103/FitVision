import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const flattened = result.error.flatten();

      res.status(400).json({
        error: 'Validation failed',
        details: flattened.fieldErrors,
        messages: flattened.formErrors,
      });
      return;
    }

    req.body = result.data;
    next();
  };
