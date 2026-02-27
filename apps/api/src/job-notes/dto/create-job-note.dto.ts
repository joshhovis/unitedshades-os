import { z } from 'zod';

export const createJobNoteSchema = z.object({
  jobId: z.string().min(1),
  content: z.string().min(1),
});

export type CreateJobNoteDto = z.infer<typeof createJobNoteSchema>;
