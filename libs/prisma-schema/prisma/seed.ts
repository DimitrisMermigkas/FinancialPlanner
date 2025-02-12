import { PrismaClient, TransactionType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // Seed Reason data
  await prisma.reason.createMany({
    data: [
      {
        title: 'Paris Trip',
        description: 'Funds allocated for trip to Paris',
        createdAt: new Date('2025-01-28T10:42:22.556Z'),
        updatedAt: new Date('2025-01-28T10:42:22.556Z'),
      },
      {
        title: 'Cuba',
        description: 'My cuba trip',
        createdAt: new Date('2025-01-28T15:25:23.263Z'),
        updatedAt: new Date('2025-01-28T15:25:23.263Z'),
      },
    ],
  });

  // Retrieve Reason entries by title to get their generated IDs
  const parisTripReason = await prisma.reason.findUnique({
    where: { title: 'Paris Trip' },
  });
  const cubaReason = await prisma.reason.findUnique({
    where: { title: 'Cuba' },
  });

  if (!parisTripReason || !cubaReason) {
    throw new Error('Reason data not found.');
  }

  // Seed Funds data
  await prisma.funds.createMany({
    data: [
      {
        amount: 717.62,
        description: null,
        createdAt: new Date('2025-01-28T10:42:22.558Z'),
        updatedAt: new Date('2025-01-28T10:42:22.558Z'),
        reasonId: parisTripReason.id,
      },
      {
        amount: -227.62,
        description: null,
        createdAt: new Date('2025-01-28T16:37:11.152Z'),
        updatedAt: new Date('2025-01-28T16:37:11.152Z'),
        reasonId: parisTripReason.id,
      },
      {
        amount: -22,
        description: null,
        createdAt: new Date('2025-01-31T19:50:11.152Z'),
        updatedAt: new Date('2025-01-31T19:50:11.152Z'),
        reasonId: parisTripReason.id,
      },
      {
        amount: 500,
        description: null,
        createdAt: new Date('2025-01-28T21:08:27.382Z'),
        updatedAt: new Date('2025-01-28T21:08:27.382Z'),
        reasonId: cubaReason.id,
      },
    ],
  });

  // Seed Balance data
  await prisma.history.createMany({
    data: [
      {
        id: uuidv4(),
        amount: 3660,
        createdAt: new Date('2025-01-30T19:21:04.189Z'),
      },
      {
        id: uuidv4(),
        amount: 2146.31,
        createdAt: new Date('2025-01-26T13:32:22.551Z'),
      },
      {
        id: uuidv4(),
        amount: 2099.31,
        createdAt: new Date('2025-01-27T13:41:02.481Z'),
      },
      {
        id: uuidv4(),
        amount: 3449.31,
        createdAt: new Date('2025-01-28T13:58:36.829Z'),
      },
      {
        id: uuidv4(),
        amount: 3676.93,
        createdAt: new Date('2025-01-28T16:57:11.164Z'),
      },
      {
        id: uuidv4(),
        amount: 3449.31,
        createdAt: new Date('2025-01-28T16:59:28.024Z'),
      },
      {
        id: uuidv4(),
        amount: 2949.31,
        createdAt: new Date('2025-01-28T21:08:30.539Z'),
      },

      {
        id: uuidv4(),
        amount: 3370.46,
        createdAt: new Date('2025-01-30T18:35:57.927Z'),
      },
      {
        id: uuidv4(),
        amount: 2945.76,
        createdAt: new Date('2025-01-30T18:37:47.691Z'),
      },
      {
        id: uuidv4(),
        amount: 2938.56,
        createdAt: new Date('2025-01-30T19:13:35.827Z'),
      },
      {
        id: uuidv4(),
        amount: 2960.56,
        createdAt: new Date('2025-02-03T19:50:12.152Z'),
      },
      {
        id: uuidv4(),
        amount: 2168.56,
        createdAt: new Date('2025-02-05T19:51:15.152Z'),
      },
      {
        id: uuidv4(),
        amount: 2477.0,
        createdAt: new Date('2025-02-06T19:51:15.152Z'),
      },
      {
        id: uuidv4(),
        amount: 2938.0,
        createdAt: new Date('2025-02-07T19:51:15.152Z'),
      },
      {
        id: uuidv4(),
        amount: 2960.0,
        createdAt: new Date('2025-02-09T19:50:12.152Z'),
      },
      {
        id: uuidv4(),
        amount: 2650.0,
        createdAt: new Date('2025-02-09T19:51:15.152Z'),
      },
      {
        id: uuidv4(),
        amount: 2864.22,
        createdAt: new Date('2025-02-10T19:51:15.152Z'),
      },
      {
        id: uuidv4(),
        amount: 3100.11,
        createdAt: new Date('2025-02-11T19:51:15.152Z'),
      },
    ],
  });

  // Retrieve the funds with specific amounts
  const fund717 = await prisma.funds.findFirst({
    where: { amount: 717.62 },
  });
  const fund500 = await prisma.funds.findFirst({
    where: { amount: 500 },
  });

  if (!fund717 || !fund500) {
    throw new Error('Reason data not found.');
  }

  // Seed Transaction data
  await prisma.transaction.createMany({
    data: [
      {
        type: TransactionType.expense,
        description: 'October Expenses',
        amount: 795.96,
        completedAt: new Date('2025-01-31T00:00:00Z'),
        fundsId: null,
      },
      {
        type: TransactionType.fund,
        description: 'Funds deposited for Paris Trip',
        amount: 717.62,
        completedAt: new Date('2025-01-15T00:00:00Z'),
        fundsId: fund717.id,
      },
      {
        type: TransactionType.expense,
        description: 'Beerway melisia',
        amount: 47,
        completedAt: new Date('2025-01-28T13:30:55.496Z'),
        fundsId: null,
      },
      {
        type: TransactionType.income,
        description: 'Official Income for October',
        amount: 1350,
        completedAt: new Date('2025-01-28T13:57:14.237Z'),
        fundsId: null,
      },
      {
        type: TransactionType.expense,
        description: 'tickets Paris and Accommodation',
        amount: 227.62,
        completedAt: new Date('2025-01-28T16:49:08.568Z'),
        fundsId: null,
      },
      {
        type: TransactionType.fund,
        description: 'Funds for Cuba',
        amount: 500,
        completedAt: new Date('2025-01-28T21:08:27.383Z'),
        fundsId: fund500.id,
      },
      {
        type: TransactionType.income,
        description: 'ΟΠΕΚΕΠΕ',
        amount: 421.15,
        completedAt: new Date('2025-01-30T18:35:42.862Z'),
        fundsId: null,
      },
      {
        type: TransactionType.expense,
        description: 'Μανα για ΟΠΕΚΕΠΕ',
        amount: 424.7,
        completedAt: new Date('2025-01-30T18:37:47.682Z'),
        fundsId: null,
      },
      {
        type: TransactionType.expense,
        description: 'efood',
        amount: 7.2,
        completedAt: new Date('2025-01-29T19:13:27.847Z'),
        fundsId: null,
      },
      {
        type: TransactionType.expense,
        description: 'efood και φακοί επαφής',
        amount: 22,
        completedAt: new Date('2025-01-31T19:51:13.152Z'),
        fundsId: null,
      },
      {
        type: TransactionType.expense,
        description: 'asfsa',
        amount: 52.2,
        completedAt: new Date('2025-02-05T18:37:47.682Z'),
        fundsId: null,
      },
      {
        type: TransactionType.expense,
        description: 'fssga',
        amount: 152.2,
        completedAt: new Date('2025-02-08T18:37:47.682Z'),
        fundsId: null,
      },
      {
        type: TransactionType.income,
        description: 'income',
        amount: 452.2,
        completedAt: new Date('2025-02-10T18:37:47.682Z'),
        fundsId: null,
      },
    ],
  });
  await prisma.currentBalance.create({
    data: {
      id: uuidv4(),
      amount: 1920.54,
      updatedAt: new Date('2025-02-12T19:21:04.189Z'),
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
