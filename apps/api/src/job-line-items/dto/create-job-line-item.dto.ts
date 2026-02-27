import { z } from 'zod';

export const createJobLineItemSchema = z.object({
  jobId: z.string().min(1),
  description: z.string().min(1),
  qty: z.number().int().min(1).default(1),
  unitPriceCents: z.number().int().min(0).default(0),
});

export type CreateJobLineItemDto = z.infer<typeof createJobLineItemSchema>;
