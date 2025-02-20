import { PrismaClient, TransactionType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // Update History entries to match transactions in chronological order
  await prisma.history.createMany({
    data: [
      // Base balances from September to January
      {
        id: uuidv4(),
        amount: 3660.0,
        createdAt: new Date('2024-09-30T23:59:59.999Z'),
      },
      {
        id: uuidv4(),
        amount: 2938.56, // 3660 - 721.44 (October expenses)
        createdAt: new Date('2024-10-31T23:59:59.999Z'),
      },
      {
        id: uuidv4(),
        amount: 1998.43, // After November transactions and 500 to Japan fund
        createdAt: new Date('2024-11-30T23:59:59.999Z'),
      },
      {
        id: uuidv4(),
        amount: 1219.45, // After January transactions and 1500 to Japan fund
        createdAt: new Date('2025-01-31T23:59:59.999Z'),
      },
      // January 2025 detailed transactions
      {
        id: uuidv4(),
        amount: 423.49, // 1219.45 - 795.96 (October expenses)
        createdAt: new Date('2025-01-31T00:00:01Z'),
      },
      {
        id: uuidv4(),
        amount: 1423.49, // 423.49 + 1000 (Salary advance)
        createdAt: new Date('2025-01-14T10:00:01Z'),
      },
      {
        id: uuidv4(),
        amount: 705.87, // 1423.49 - 717.62 (Paris Trip funds)
        createdAt: new Date('2025-01-15T00:00:01Z'),
      },
      {
        id: uuidv4(),
        amount: 658.87, // 705.87 - 47 (Beerway)
        createdAt: new Date('2025-01-28T13:30:56Z'),
      },
      {
        id: uuidv4(),
        amount: 2008.87, // 658.87 + 1350 (Income)
        createdAt: new Date('2025-01-28T13:57:15Z'),
      },
      {
        id: uuidv4(),
        amount: 1781.25, // 2008.87 - 227.62 (Paris tickets)
        createdAt: new Date('2025-01-28T16:49:09Z'),
      },
      {
        id: uuidv4(),
        amount: 1281.25, // 1781.25 - 500 (Cuba funds)
        createdAt: new Date('2025-01-28T21:08:28Z'),
      },
      {
        id: uuidv4(),
        amount: 1702.4, // 1281.25 + 421.15 (ΟΠΕΚΕΠΕ income)
        createdAt: new Date('2025-01-30T18:35:43Z'),
      },
      {
        id: uuidv4(),
        amount: 1277.7, // 1702.40 - 424.7 (ΟΠΕΚΕΠΕ expense)
        createdAt: new Date('2025-01-30T18:37:48Z'),
      },
      {
        id: uuidv4(),
        amount: 1270.5, // 1277.70 - 7.2 (efood)
        createdAt: new Date('2025-01-29T19:13:28Z'),
      },
      {
        id: uuidv4(),
        amount: 1248.5, // 1270.50 - 22 (efood and contacts)
        createdAt: new Date('2025-01-31T19:51:14Z'),
      },
      // February 2025 transactions
      {
        id: uuidv4(),
        amount: 1196.3, // 1248.50 - 52.2
        createdAt: new Date('2025-02-05T18:37:48Z'),
      },
      {
        id: uuidv4(),
        amount: 1044.1, // 1196.30 - 152.2
        createdAt: new Date('2025-02-08T18:37:48Z'),
      },
      {
        id: uuidv4(),
        amount: 1496.3, // 1044.10 + 452.2 (income)
        createdAt: new Date('2025-02-10T18:37:48Z'),
      },
    ],
  });

  // Add Japan Trip reason
  await prisma.reason.createMany({
    data: [
      {
        id: uuidv4(),
        title: 'Japan Trip',
        description: 'Savings for Japan trip in March 2025',
        createdAt: new Date('2024-11-23T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      },
      {
        id: uuidv4(),
        title: 'Savings for Investments',
        description: 'Savings for Investments',
        createdAt: new Date('2025-10-03T10:00:00.000Z'),
        updatedAt: new Date('2025-01-15T10:00:00.000Z'),
      },
    ],
  });

  const japanReason = await prisma.reason.findUnique({
    where: { title: 'Japan Trip' },
  });
  const investmentsReason = await prisma.reason.findUnique({
    where: { title: 'Savings for Investments' },
  });

  if (!japanReason) {
    throw new Error('Japan reason not found');
  }
  if (!investmentsReason) {
    throw new Error('Investments reason not found');
  }

  // Update Japan Trip funds and other savings
  await prisma.funds.createMany({
    data: [
      // Japan Trip savings
      {
        amount: 2000.0,
        description: 'Savings for Japan trip in March',
        createdAt: new Date('2024-11-15T10:00:00.000Z'),
        updatedAt: new Date('2025-01-31T23:59:59.999Z'),
        reasonId: japanReason.id,
      },
      // General savings
      {
        amount: 2009.72,
        description: 'General savings',
        createdAt: new Date('2024-11-01T10:00:00.000Z'),
        updatedAt: new Date('2025-01-31T23:59:59.999Z'),
        reasonId: investmentsReason.id,
      },
    ],
  });

  const japanFund = await prisma.funds.findFirst({
    where: {
      reasonId: japanReason.id,
      amount: 2000,
    },
  });
  const investmentsFund = await prisma.funds.findFirst({
    where: {
      reasonId: investmentsReason.id,
      amount: 2009.72,
    },
  });

  if (!japanFund) {
    throw new Error('Japan fund not found');
  }
  if (!investmentsFund) {
    throw new Error('Investments fund not found');
  }

  // Add related transactions
  await prisma.transaction.createMany({
    data: [
      {
        type: TransactionType.fund,
        description: 'Initial deposit for Japan trip',
        amount: 1000,
        completedAt: new Date('2025-01-15T10:00:00.000Z'),
        fundsId: japanFund.id,
      },
      {
        type: TransactionType.fund,
        description: 'Second deposit for Japan trip',
        amount: 500,
        completedAt: new Date('2025-01-30T15:00:00.000Z'),
        fundsId: japanFund.id,
      },
      {
        type: TransactionType.fund,
        description: 'Third deposit for Japan trip',
        amount: 500,
        completedAt: new Date('2025-02-10T16:00:00.000Z'),
        fundsId: japanFund.id,
      },
    ],
  });

  // Add the Goal connected to Japan Trip reason
  await prisma.goal.create({
    data: {
      id: uuidv4(),
      description: 'Japan Trip Savings',
      amount: 3000,
      dueDate: new Date('2025-03-29T10:00:00.000Z'),
      type: 'SAVINGS',
      status: 'IN_PROGRESS',
      createdAt: new Date('2025-01-15T10:00:00.000Z'),
      reasonId: japanReason.id, // Connect to Japan Trip reason
    },
  });

  // Optional: Add a goal for investments reason
  await prisma.goal.create({
    data: {
      id: uuidv4(),
      description: 'Investment Savings Target',
      amount: 5000,
      type: 'SAVINGS',
      status: 'IN_PROGRESS',
      createdAt: new Date('2025-01-15T10:00:00.000Z'),
      reasonId: investmentsReason.id, // Connect to Investments reason
    },
  });

  // Add transactions to match history entries
  await prisma.transaction.createMany({
    data: [
      // Base transactions from September to January
      {
        type: TransactionType.expense,
        description: 'October Monthly Expenses',
        amount: 721.44, // 3660 - 2938.56
        completedAt: new Date('2024-10-31T15:00:00.000Z'),
        fundsId: null,
      },
      {
        type: TransactionType.expense,
        description: 'November Expenses and Japan Fund',
        amount: 940.13, // 2938.56 - 1998.43
        completedAt: new Date('2024-11-30T15:00:00.000Z'),
        fundsId: null,
      },
      {
        type: TransactionType.expense,
        description: 'January Expenses and Japan Fund',
        amount: 778.98, // 1998.43 - 1219.45
        completedAt: new Date('2025-01-31T15:00:00.000Z'),
        fundsId: null,
      },
      // January 2025 detailed transactions
      {
        type: TransactionType.expense,
        description: 'October expenses settlement',
        amount: 795.96, // 1219.45 - 423.49
        completedAt: new Date('2025-01-31T00:00:00Z'),
        fundsId: null,
      },
      {
        type: TransactionType.income,
        description: 'Salary advance',
        amount: 1000.0, // 423.49 -> 1423.49
        completedAt: new Date('2025-01-14T10:00:00Z'),
        fundsId: null,
      },
      {
        type: TransactionType.fund,
        description: 'Initial deposit for Japan trip',
        amount: 717.62, // 1423.49 - 705.87
        completedAt: new Date('2025-01-15T00:00:00Z'),
        fundsId: japanFund.id,
      },
      {
        type: TransactionType.expense,
        description: 'Beerway',
        amount: 47.0, // 705.87 - 658.87
        completedAt: new Date('2025-01-28T13:30:55Z'),
        fundsId: null,
      },
      {
        type: TransactionType.income,
        description: 'Income',
        amount: 1350.0, // 658.87 -> 2008.87
        completedAt: new Date('2025-01-28T13:57:14Z'),
        fundsId: null,
      },
      {
        type: TransactionType.fund,
        description: 'Second deposit for Japan trip',
        amount: 227.62, // 2008.87 - 1781.25
        completedAt: new Date('2025-01-28T16:49:08Z'),
        fundsId: japanFund.id,
      },
      {
        type: TransactionType.fund,
        description: 'Investment savings deposit',
        amount: 500.0, // 1781.25 - 1281.25
        completedAt: new Date('2025-01-28T21:08:27Z'),
        fundsId: investmentsFund.id,
      },
      {
        type: TransactionType.income,
        description: 'ΟΠΕΚΕΠΕ income',
        amount: 421.15, // 1281.25 -> 1702.40
        completedAt: new Date('2025-01-30T18:35:42Z'),
        fundsId: null,
      },
      {
        type: TransactionType.expense,
        description: 'ΟΠΕΚΕΠΕ expense',
        amount: 424.7, // 1702.40 - 1277.70
        completedAt: new Date('2025-01-30T18:37:47Z'),
        fundsId: null,
      },
      {
        type: TransactionType.expense,
        description: 'efood',
        amount: 7.2, // 1277.70 - 1270.50
        completedAt: new Date('2025-01-29T19:13:27Z'),
        fundsId: null,
      },
      {
        type: TransactionType.expense,
        description: 'efood and contacts',
        amount: 22.0, // 1270.50 - 1248.50
        completedAt: new Date('2025-01-31T19:51:13Z'),
        fundsId: null,
      },
      // February 2025 transactions
      {
        type: TransactionType.expense,
        description: 'February expense 1',
        amount: 52.2, // 1248.50 - 1196.30
        completedAt: new Date('2025-02-05T18:37:47Z'),
        fundsId: null,
      },
      {
        type: TransactionType.expense,
        description: 'February expense 2',
        amount: 152.2, // 1196.30 - 1044.10
        completedAt: new Date('2025-02-08T18:37:47Z'),
        fundsId: null,
      },
      {
        type: TransactionType.income,
        description: 'February income',
        amount: 452.2, // 1044.10 -> 1496.30
        completedAt: new Date('2025-02-10T18:37:47Z'),
        fundsId: null,
      },
      {
        type: TransactionType.expense,
        description: 'Train tickets for Japan',
        amount: 400.25, // 1496.30 -> 1096.05
        completedAt: new Date('2025-03-10T18:37:47Z'),
        fundsId: null,
      },
    ],
  });

  // Update current balance to match latest state
  await prisma.currentBalance.create({
    data: {
      id: uuidv4(),
      amount: 5222.55, // 1219.45 (balance) + 4009.72 (total funds)
      updatedAt: new Date('2024-02-17T23:59:59.999Z'),
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
