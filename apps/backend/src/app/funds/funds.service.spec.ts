import { Test, TestingModule } from '@nestjs/testing';
import { FundsService } from './funds.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('FundsService', () => {
  let service: FundsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [FundsService],
    }).compile();

    service = module.get<FundsService>(FundsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
