import { z } from 'zod';

export const updateJobSchema = z.object({
  status: z
    .enum(['DRAFT', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'])
    .optional(),
  scheduledAt: z.string().datetime().nullable().optional(), // ISO or null
  completedAt: z.string().datetime().nullable().optional(), // ISO or null
  notes: z.string().nullable().optional(),
});

export type UpdateJobDto = z.infer<typeof updateJobSchema>;
