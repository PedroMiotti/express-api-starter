import type { NextFunction, Request, Response } from 'express';
import { type AnyZodObject, ZodError } from 'zod';

import { Result } from '@/shared/http/Result';

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = new Result();
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
        result.setError(
          error.errors.map((e) => e.message),
          400,
        );
        res.status(+result.statusCode).send(result);
      } else {
        next(error);
      }
    }
  };
