import { z } from 'zod';

export enum TransactionType {
  income = "income", // Money coming in
  expense = "expense", // Money going out
  fund = "fund", // Money set aside in Funds (not considered an expense)
}

// Transaction Schema
export const TransactionSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(TransactionType), // Using native enum for validation
  description: z.string().optional(),
  amount: z.number().nonnegative(), // Ensuring it's a positive number
  completedAt: z.date(),
  fundsId: z.string().uuid().optional(),
});

// Array Schema for Transactions
export const TransactionArraySchema = z.array(TransactionSchema);

// Exporting inferred type
export type Transaction = z.infer<typeof TransactionSchema>;

// DTOs
export const CreateTransactionDto = z.object({
  type: z.nativeEnum(TransactionType),
  description: z.string().optional(),
  amount: z.number().nonnegative(), // Ensuring it's a positive number
  completedAt: z.date(),
  fundsId: z.string().uuid().optional(),
});

// Exporting inferred type for DTO
export type CreateTransaction = z.infer<typeof CreateTransactionDto>;
