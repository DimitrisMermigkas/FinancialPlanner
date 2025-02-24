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
      expiryDate: new Date('2026-12'),
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
      dueDate: new Date('2025-03-29'),
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
      amount: 1000,
      updatedAt: new Date('2024-11-22'),
      description: 'Investments',
      reasonId: investmentsReason.id,
    },
    {
      amount: 500,
      updatedAt: new Date('2024-12-13'),
      description: 'Japan Trip',
      reasonId: japanReason.id,
    },
    {
      amount: 500,
      updatedAt: new Date('2024-12-23'),
      description: 'Japan Trip',
      reasonId: japanReason.id,
    },
    {
      amount: 511,
      updatedAt: new Date('2024-12-26'),
      description: 'Investments',
      reasonId: investmentsReason.id,
    },
    {
      amount: 1000,
      updatedAt: new Date('2025-01-27'),
      description: 'Japan Trip',
      reasonId: japanReason.id,
    },
    {
      amount: 500,
      updatedAt: new Date('2025-01-27'),
      description: 'Investments',
      reasonId: investmentsReason.id,
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

  // Create balance history entries
  const balanceHistory = [
    {
      amount: 2210,
      updatedAt: new Date('2024-09-30T13:00:00.000Z'),
      createdAt: new Date('2024-09-30T13:00:00.000Z'),
    },
    {
      amount: 2938.56,
      updatedAt: new Date('2024-10-30T13:00:00.000Z'),
      createdAt: new Date('2024-10-30T13:00:00.000Z'),
    },
    {
      amount: 1998.43,
      updatedAt: new Date('2024-11-30T13:00:00.000Z'),
      createdAt: new Date('2024-11-30T13:00:00.000Z'),
    },
    {
      amount: 2387.43,
      updatedAt: new Date('2024-12-30T13:00:00.000Z'),
      createdAt: new Date('2024-12-30T13:00:00.000Z'),
    },
    {
      amount: 1219.45,
      updatedAt: new Date('2025-01-30T13:00:00.000Z'),
      createdAt: new Date('2025-01-30T13:00:00.000Z'),
    },
    {
      amount: 1496.72,
      updatedAt: new Date('2025-02-03T13:00:00.000Z'),
      createdAt: new Date('2025-02-03T13:00:00.000Z'),
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

  // Create some expense transactions to match the balance changes
  const expenses = [
    {
      amount: 721.44, // September to October difference
      completedAt: new Date('2024-10-15'),
      description: 'Monthly expenses October',
    },
    {
      amount: 940.13, // October to November difference
      completedAt: new Date('2024-11-15'),
      description: 'Monthly expenses November',
    },
    {
      amount: 779.11, // November to December expenses
      completedAt: new Date('2024-12-15'),
      description: 'Monthly expenses December',
    },
    {
      amount: 778.98, // December to January expenses
      completedAt: new Date('2025-01-15'),
      description: 'Monthly expenses January',
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
      amount: 276.55,
      completedAt: new Date('2025-02-03'),
      description: 'Extra Income February',
      paymentMethod: PaymentMethod.CARD,
      cardId: card.id,
    },
  });
  // Update current balance to match latest state
  await prisma.currentBalance.create({
    data: {
      id: uuidv4(),
      amount: 1496.72,
      updatedAt: new Date('2025-02-03T23:59:59.999Z'),
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
