import { z } from 'zod';

// Funds Schema
export const FundsSchema = z.object({
  id: z.string().uuid(),
  amount: z.coerce.number(),
  description: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
  reasonId: z.string().uuid(),
});

// Array Schema for Funds
export const FundsArraySchema = z.array(FundsSchema);

// Exporting inferred type
export type Funds = z.infer<typeof FundsSchema>;

// DTOs
export const CreateFundsDto = z.object({
  amount: z.coerce.number().nonnegative(), // Ensuring it's a positive number
  reasonId: z.string().uuid(),
  description: z.string().optional(),
});

// Exporting inferred type for DTO
export type CreateFunds = z.infer<typeof CreateFundsDto>;
