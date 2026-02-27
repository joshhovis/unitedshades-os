import { z } from 'zod';

export const updateJobLineItemSchema = z.object({
  description: z.string().min(1).optional(),
  qty: z.number().int().min(1).optional(),
  unitPriceCents: z.number().int().min(0).optional(),
});

export type UpdateJobLineItemDto = z.infer<typeof updateJobLineItemSchema>;
