import { z } from 'zod';

export const createVehicleSchema = z.object({
  customerId: z.string().min(1),
  year: z.number().int().min(1900).max(2100).optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  trim: z.string().optional(),
  vin: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateVehicleDto = z.infer<typeof createVehicleSchema>;
