import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().min(1),
  phoneRaw: z.string().optional(),
  email: z.string().email().optional(),
  notes: z.string().optional(),
});

export type CreateCustomerDto = z.infer<typeof createCustomerSchema>;
