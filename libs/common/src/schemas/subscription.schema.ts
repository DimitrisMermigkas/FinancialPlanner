import { z } from 'zod';
import { PaymentMethod, TransactionType } from './transaction.schema';

export enum SubscriptionFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}
// Update SubscriptionSchema
export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(TransactionType),
  description: z.string().optional(),
  amount: z.coerce.number().nonnegative().min(1, 'Amount should not be 0'),
  frequency: z.nativeEnum(SubscriptionFrequency),
  startDate: z.date(),
  endDate: z.date().optional(),
  lastExecuted: z.date().optional(),
  active: z.boolean().default(true),
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.CARD),
  cardId: z.string().uuid().optional(),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;

// Update CreateSubscriptionDto
export const CreateSubscription = z.object({
  type: z.nativeEnum(TransactionType),
  description: z.string().optional(),
  amount: z.coerce.number().nonnegative().min(1, 'Amount should not be 0'),
  frequency: z.nativeEnum(SubscriptionFrequency),
  startDate: z.date(),
  endDate: z.date().optional(),
  lastExecuted: z.date().optional(),
  active: z.boolean().default(true),
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.CARD),
  cardId: z.string().uuid().optional(),
});
export type CreateSubscription = z.infer<typeof CreateSubscription>;

export const UpdateSubscription = CreateSubscription.partial();
export type UpdateSubscription = z.infer<typeof UpdateSubscription>;
export const DeleteSubscription = z.object({
  id: z.string().uuid(),
});
export type DeleteSubscription = z.infer<typeof DeleteSubscription>;
