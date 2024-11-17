import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from './balance.service';
import { PrismaModule } from '../prisma/prisma.module'; // Update this import according to your actual Prisma module path

describe('BalanceService', () => {
  let service: BalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule], // Import the Prisma module that contains PrismaService
      providers: [BalanceService],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
