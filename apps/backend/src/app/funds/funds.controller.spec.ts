import { Test, TestingModule } from '@nestjs/testing';
import { FundsController } from './funds.controller';
import { FundsService } from './funds.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('FundsController', () => {
  let controller: FundsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [FundsController],
      providers: [FundsService],
    }).compile();

    controller = module.get<FundsController>(FundsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
