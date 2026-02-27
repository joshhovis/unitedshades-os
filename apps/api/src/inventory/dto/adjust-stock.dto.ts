import { z } from 'zod';

export const adjustStockSchema = z.object({
  itemId: z.string().min(1),
  qtyChange: z.number().int(), // + or -
  reason: z.enum(['RESTOCK', 'JOB_USAGE', 'WASTE', 'ADJUSTMENT']),
  note: z.string().optional(),
  jobId: z.string().optional(),
});

export type AdjustStockDto = z.infer<typeof adjustStockSchema>;
