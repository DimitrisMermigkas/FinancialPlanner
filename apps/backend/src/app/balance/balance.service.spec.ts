import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from './balance.service';
import { PrismaModule } from '../prisma/prisma.module'; // Update this import according to your actual Prisma module path
import { PrismaService } from '../prisma/prisma.service';

describe('BalanceService', () => {
  let service: BalanceService;
  let prisma: PrismaService;

  const mockPrismaService = {
    balance: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule], // Import the Prisma module that contains PrismaService
      providers: [
        BalanceService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
