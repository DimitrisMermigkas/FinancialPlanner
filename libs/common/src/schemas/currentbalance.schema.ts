import { z } from 'zod';

// History Schema
export const CurrentBalanceSchema = z.object({
  id: z.string().uuid(),
  amount: z.coerce.number(), // Current balance in the main account
  updatedAt: z.date(),
});

// Array Schema for Balances
export const CurrentBalanceArraySchema = z.array(CurrentBalanceSchema);

// Exporting inferred type
export type CurrentBalance = z.infer<typeof CurrentBalanceSchema>;

// DTOs
export const CurrentBalanceUpdateDto = z.object({
  amount: z.coerce.number(),
  updatedAt: z.date(),
});

// Exporting inferred type for DTO
export type UpdateCurrentBalance = z.infer<typeof CurrentBalanceUpdateDto>;
