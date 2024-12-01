import { z } from 'zod';

// History Schema
export const HistorySchema = z.object({
  id: z.string().uuid(),
  amount: z.coerce.number(), // Current balance in the main account
  updatedAt: z.date().optional(),
  createdAt: z.date().optional(),
});

// Array Schema for Balances
export const HistoryArraySchema = z.array(HistorySchema);

// Exporting inferred type
export type History = z.infer<typeof HistorySchema>;

// DTOs
export const HistoryDto = z.object({
  amount: z.coerce.number(), // Ensuring it's a positive number
});

// Exporting inferred type for DTO
export type CreateHistory = z.infer<typeof HistoryDto>;
