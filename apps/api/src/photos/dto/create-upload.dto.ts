import { z } from 'zod';

export const createUploadSchema = z.object({
  jobId: z.string().min(1),
  customerId: z.string().min(1),
  fileName: z.string().min(1),
  contentType: z.string().min(1),
});

export type CreateUploadDto = z.infer<typeof createUploadSchema>;
