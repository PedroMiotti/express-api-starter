import { z } from 'zod';

export const BasePaginatedGetSchema = z.object({
  query: z.object({
    page: z.coerce
      .number({
        invalid_type_error: 'Página deve ser um número',
        description: 'property "page"',
      })
      .int()
      .min(0, 'Página deve ser pelo menos 0')
      .optional(),
    limit: z.coerce
      .number({
        invalid_type_error: 'Limite deve ser um número',
        description: 'property "limit"',
      })
      .int()
      .min(1, 'Limite deve ser pelo menos 1')
      .optional(),
    query: z
      .string({
        invalid_type_error: 'Query deve ser uma string',
      })
      .optional(),
    sort: z
      .string({
        invalid_type_error: 'Sort deve ser uma string',
      })
      .optional(),
    order: z
      .string({
        invalid_type_error: 'Order deve ser uma string',
      })
      .optional(),
  }),
});
