import type { NextFunction, Request, Response } from 'express';
import { ZodError, type ZodType } from 'zod';

import { ValidationError } from '@/shared/error/ValidationError';

type RequestWithOptionalFile = Request & { file?: unknown };

export const validate =
  (schema: ZodType) =>
  async (req: RequestWithOptionalFile, _res: Response, next: NextFunction) => {
    try {
      const validationResult = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        file: req.file,
      });

      req.body = validationResult.body;
      req.query = validationResult.query;
      req.params = validationResult.params;
      req.file = validationResult.file;

      return next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        next(new ValidationError(error.errors.map((e) => e.message)));
      } else {
        next(error);
      }
    }
  };
