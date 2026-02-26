import { z } from 'zod';

export const createJobSchema = z.object({
  customerId: z.string().min(1),
  vehicleId: z.string().optional(),
  scheduledAt: z.string().datetime().optional(), // ISO
  notes: z.string().optional(),
});

export type CreateJobDto = z.infer<typeof createJobSchema>;
