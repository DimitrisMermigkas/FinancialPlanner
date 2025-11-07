import {
  PrismaClient,
  TransactionType,
  GoalType,
  GoalStatus,
  PaymentMethod,
} from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // First, create the card
  const card = await prisma.card.create({
    data: {
      id: uuidv4(),
      expiryDate: new Date('2028-12'),
      name: 'DIMITRIOS MERMIGKAS',
      type: 'CREDIT',
      lastFourDigits: '0008',
      isDefault: true,
    },
  });

  // Create reasons
  const investmentsReason = await prisma.reason.create({
    data: {
      id: uuidv4(),
      title: 'Investments',
      description: 'Long term investments savings',
    },
  });

  const japanReason = await prisma.reason.create({
    data: {
      id: uuidv4(),
      title: 'Japan Trip',
      description: 'Savings for Japan vacation',
    },
  });

  // Create goals
  await prisma.goal.create({
    data: {
      id: uuidv4(),
      description: 'Japan Trip Savings Goal',
      amount: 3000,
      type: GoalType.SAVINGS,
      status: GoalStatus.IN_PROGRESS,
      dueDate: new Date('2026-03-29'),
      reasonId: japanReason.id,
    },
  });

  await prisma.goal.create({
    data: {
      id: uuidv4(),
      description: 'Investment Portfolio Goal',
      amount: 5000,
      type: GoalType.SAVINGS,
      status: GoalStatus.IN_PROGRESS,
      dueDate: new Date('2025-12-31'),
      reasonId: investmentsReason.id,
    },
  });

  // Create Funds entries
  const fundsEntries = [
    {
      amount: 750,
      updatedAt: new Date('2025-03-05'),
      description: 'Investments',
      reasonId: investmentsReason.id,
    },
    {
      amount: 600,
      updatedAt: new Date('2025-03-20'),
      description: 'Japan Trip',
      reasonId: japanReason.id,
    },
    {
      amount: 900,
      updatedAt: new Date('2025-04-10'),
      description: 'Investments',
      reasonId: investmentsReason.id,
    },
    {
      amount: 450,
      updatedAt: new Date('2025-04-22'),
      description: 'Japan Trip',
      reasonId: japanReason.id,
    },
    {
      amount: 800,
      updatedAt: new Date('2025-05-15'),
      description: 'Japan Trip',
      reasonId: japanReason.id,
    },
    {
      amount: 650,
      updatedAt: new Date('2025-06-12'),
      description: 'Investments',
      reasonId: investmentsReason.id,
    },
    {
      amount: 500,
      updatedAt: new Date('2025-07-18'),
      description: 'Investments',
      reasonId: investmentsReason.id,
    },
    {
      amount: 700,
      updatedAt: new Date('2025-08-09'),
      description: 'Japan Trip',
      reasonId: japanReason.id,
    },
    {
      amount: 550,
      updatedAt: new Date('2025-09-14'),
      description: 'Investments',
      reasonId: investmentsReason.id,
    },
    {
      amount: 200,
      updatedAt: new Date('2025-10-03'),
      description: 'Japan Trip',
      reasonId: japanReason.id,
    },
  ];

  for (const fund of fundsEntries) {
    const fundEntry = await prisma.funds.create({
      data: {
        id: uuidv4(),
        ...fund,
      },
    });

    // Create corresponding transaction for each fund
    await prisma.transaction.create({
      data: {
        id: uuidv4(),
        type: TransactionType.fund,
        description: fund.description,
        amount: fund.amount,
        completedAt: fund.updatedAt,
        fundsId: fundEntry.id,
        paymentMethod: PaymentMethod.CARD,
        cardId: card.id,
      },
    });
  }

  // Create balance history entries (recent months)
  const balanceHistory = [
    {
      amount: 2200.0,
      updatedAt: new Date('2025-03-31T13:00:00.000Z'),
      createdAt: new Date('2025-03-31T13:00:00.000Z'),
    },
    {
      amount: 2450.25,
      updatedAt: new Date('2025-04-30T13:00:00.000Z'),
      createdAt: new Date('2025-04-30T13:00:00.000Z'),
    },
    {
      amount: 2310.85,
      updatedAt: new Date('2025-05-31T13:00:00.000Z'),
      createdAt: new Date('2025-05-31T13:00:00.000Z'),
    },
    {
      amount: 2600.4,
      updatedAt: new Date('2025-06-30T13:00:00.000Z'),
      createdAt: new Date('2025-06-30T13:00:00.000Z'),
    },
    {
      amount: 2750.9,
      updatedAt: new Date('2025-07-31T13:00:00.000Z'),
      createdAt: new Date('2025-07-31T13:00:00.000Z'),
    },
    {
      amount: 2905.65,
      updatedAt: new Date('2025-08-31T13:00:00.000Z'),
      createdAt: new Date('2025-08-31T13:00:00.000Z'),
    },
    {
      amount: 3058.3,
      updatedAt: new Date('2025-09-30T13:00:00.000Z'),
      createdAt: new Date('2025-09-30T13:00:00.000Z'),
    },
    {
      amount: 3275.0,
      updatedAt: new Date('2025-10-31T16:00:00.000Z'),
      createdAt: new Date('2025-10-31T16:00:00.000Z'),
    },
  ];

  for (const balance of balanceHistory) {
    await prisma.history.create({
      data: {
        id: uuidv4(),
        ...balance,
        createdAt: balance.createdAt.toISOString(),
        updatedAt: balance.updatedAt.toISOString(),
      },
    });
  }

  // Create some expense transactions to match the balance changes (2025)
  const expenses = [
    {
      amount: 610.35,
      completedAt: new Date('2025-03-15'),
      description: 'Monthly expenses March',
    },
    {
      amount: 540.75,
      completedAt: new Date('2025-04-15'),
      description: 'Monthly expenses April',
    },
    {
      amount: 785.9,
      completedAt: new Date('2025-05-15'),
      description: 'Monthly expenses May',
    },
    {
      amount: 620.4,
      completedAt: new Date('2025-06-15'),
      description: 'Monthly expenses June',
    },
    {
      amount: 670.15,
      completedAt: new Date('2025-07-15'),
      description: 'Monthly expenses July',
    },
    {
      amount: 590.2,
      completedAt: new Date('2025-08-15'),
      description: 'Monthly expenses August',
    },
    {
      amount: 735.6,
      completedAt: new Date('2025-09-15'),
      description: 'Monthly expenses September',
    },
    {
      amount: 680.9,
      completedAt: new Date('2025-10-15'),
      description: 'Monthly expenses October',
    },
  ];

  for (const expense of expenses) {
    await prisma.transaction.create({
      data: {
        id: uuidv4(),
        type: TransactionType.expense,
        ...expense,
        paymentMethod: PaymentMethod.CARD,
        cardId: card.id,
      },
    });
  }
  await prisma.transaction.create({
    data: {
      id: uuidv4(),
      type: TransactionType.income,
      amount: 350.0,
      completedAt: new Date('2025-03-10'),
      description: 'Freelance work March',
      paymentMethod: PaymentMethod.CARD,
      cardId: card.id,
    },
  });
  await prisma.transaction.create({
    data: {
      id: uuidv4(),
      type: TransactionType.income,
      amount: 420.5,
      completedAt: new Date('2025-06-20'),
      description: 'Bonus June',
      paymentMethod: PaymentMethod.CARD,
      cardId: card.id,
    },
  });
  await prisma.transaction.create({
    data: {
      id: uuidv4(),
      type: TransactionType.income,
      amount: 515.25,
      completedAt: new Date('2025-09-28'),
      description: 'Side project payout September',
      paymentMethod: PaymentMethod.CARD,
      cardId: card.id,
    },
  });
  // Update current balance to match latest state (October 2025)
  await prisma.currentBalance.create({
    data: {
      id: uuidv4(),
      amount: 3275.0,
      updatedAt: new Date('2025-10-31T16:00:00.000Z'),
    },
  });

  // Create a rent subscription
  await prisma.subscription.create({
    data: {
      id: uuidv4(),
      type: TransactionType.expense,
      description: 'Monthly Rent',
      amount: 550,
      frequency: 'MONTHLY',
      startDate: new Date('2025-03-03'), // Starting from March 3rd
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      active: true,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
