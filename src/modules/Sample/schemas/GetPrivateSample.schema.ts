import { z } from 'zod';

export const GetPrivateSampleSchema = z.object({
  query: z.object({
    includeMeta: z.coerce.boolean().optional(),
  }),
});
