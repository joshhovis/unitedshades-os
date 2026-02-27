import { z } from 'zod';

export const updateVehicleSchema = z.object({
  year: z.number().int().min(1900).max(2100).nullable().optional(),
  make: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  trim: z.string().nullable().optional(),
  vin: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type UpdateVehicleDto = z.infer<typeof updateVehicleSchema>;
