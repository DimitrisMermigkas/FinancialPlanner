import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('BalanceController', () => {
  let controller: BalanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [BalanceController],
      providers: [BalanceService],
    }).compile();

    controller = module.get<BalanceController>(BalanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
