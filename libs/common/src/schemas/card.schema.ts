import { z } from 'zod';

export enum CardType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

// Card Schema
export const CardSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.nativeEnum(CardType),
  lastFourDigits: z.string().length(4),
  expiryDate: z.date(),
  isDefault: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date(),
});

// Array Schema for Cards
export const CardArraySchema = z.array(CardSchema);

// Exporting inferred type
export type Card = z.infer<typeof CardSchema>;

// DTOs
export const CreateCardDto = z.object({
  name: z.string(),
  type: z.nativeEnum(CardType),
  lastFourDigits: z.string().length(4),
  expiryDate: z.date(),
  isDefault: z.boolean().default(false),
});

// Exporting inferred type for DTO
export type CreateCard = z.infer<typeof CreateCardDto>; 