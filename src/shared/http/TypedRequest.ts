import type { Request, RequestHandler } from 'express';
import type { ZodObject, ZodType, ZodTypeDef, z } from 'zod';

export type RouteHandler = RequestHandler<
  Record<string, string>,
  unknown,
  unknown,
  unknown,
  Record<string, unknown>
>;

type ExtractSchema<T> =
  T extends ZodObject<infer U>
    ? {
        [K in keyof U]: U[K] extends ZodType<unknown, ZodTypeDef, unknown>
          ? U[K]
          : never;
      }
    : never;

type ExtractableKeys = 'params' | 'body' | 'query' | 'file';
type FilterSchema<T> = Pick<T, ExtractableKeys & keyof T>;

export type TypedRequest<
  TSchema extends ZodType<unknown, ZodTypeDef, unknown>,
> = Request<
  z.infer<FilterSchema<ExtractSchema<TSchema>>['params']>,
  unknown,
  z.infer<FilterSchema<ExtractSchema<TSchema>>['body']>,
  z.infer<FilterSchema<ExtractSchema<TSchema>>['query']>,
  z.infer<FilterSchema<ExtractSchema<TSchema>>['file']>
>;
