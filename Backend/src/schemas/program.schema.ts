import { z } from 'zod';

export const generateProgramSchema = z.object({
  prompt: z.string().min(10, 'Prompt phải có ít nhất 10 ký tự').max(1000),
  context: z.string().max(500).optional(),
});

export type GenerateProgramInput = z.infer<typeof generateProgramSchema>;
