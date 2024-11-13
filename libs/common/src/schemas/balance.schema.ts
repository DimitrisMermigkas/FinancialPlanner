import { z } from 'zod';

// Balance Schema
export const BalanceSchema = z.object({
  id: z.string().uuid(),
  amount: z.coerce.number(), // Current balance in the main account
  updatedAt: z.date().optional(),
});

// Array Schema for Balances
export const BalanceArraySchema = z.array(BalanceSchema);

// Exporting inferred type
export type Balance = z.infer<typeof BalanceSchema>;

// DTOs
export const CreateBalanceDto = z.object({
  amount: z.coerce.number(), // Ensuring it's a positive number
});

// Exporting inferred type for DTO
export type CreateBalance = z.infer<typeof CreateBalanceDto>;
