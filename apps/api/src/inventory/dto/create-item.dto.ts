import { z } from 'zod';

export const createInventoryItemSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1).optional(),
  unit: z.string().min(1).optional(),
  reorderThreshold: z.number().int().min(0).optional(),
});

export type CreateInventoryItemDto = z.infer<typeof createInventoryItemSchema>;
