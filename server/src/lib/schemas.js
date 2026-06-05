import { z } from 'zod';

export const generateArcSchema = z.object({
  body: z.object({
    targetField: z.string().min(1, "Target field is required").max(100),
    goals: z.string().min(1, "Goals are required").max(500),
    availableHours: z.number().min(1).max(24),
    weakAreas: z.string().max(300).optional().default("None specified"),
  })
});

export const verifyTaskSchema = z.object({
  body: z.object({
    taskId: z.string().uuid("Invalid task ID"),
    answer: z.string().min(1, "Answer is required").max(2000),
  })
});
