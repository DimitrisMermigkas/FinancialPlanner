import { z } from 'zod';

// Reason Schema
export const ReasonSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1), // Ensuring title is not empty
  description: z.string().optional().nullable(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

// Array Schema for Reasons
export const ReasonArraySchema = z.array(ReasonSchema);

// Exporting inferred type
export type Reason = z.infer<typeof ReasonSchema>;

// DTOs
export const CreateReasonDto = z.object({
  title: z.string().min(1), // Ensuring title is not empty
  description: z.string().optional(),
});

// Exporting inferred type for DTO
export type CreateReason = z.infer<typeof CreateReasonDto>;
