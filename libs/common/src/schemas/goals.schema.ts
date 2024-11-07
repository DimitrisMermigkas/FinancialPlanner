import { z } from 'zod';

// Goals Schema
export const GoalsSchema = z.object({
  id: z.string().uuid(),
  amount: z.number(),
  description: z.string(),
  createdAt: z.date().default(() => new Date()),
  type: z.enum(['LIMIT', 'SAVINGS']),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'ACHIEVED', 'FAILED']),
});

// Array Schema for Goals
export const GoalsArraySchema = z.array(GoalsSchema);

// Exporting inferred type
export type Goals = z.infer<typeof GoalsSchema>;

// DTOs
export const CreateGoalsDto = z.object({
  amount: z.number().nonnegative(), // Ensuring it's a positive number
  description: z.string(),
  type: z.enum(['LIMIT', 'SAVINGS']),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'ACHIEVED', 'FAILED']),
});

// Exporting inferred type for DTO
export type CreateGoals = z.infer<typeof CreateGoalsDto>;
