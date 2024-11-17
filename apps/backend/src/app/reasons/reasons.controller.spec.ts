import { Test, TestingModule } from '@nestjs/testing';
import { ReasonsController } from './reasons.controller';
import { ReasonsService } from './reasons.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('ReasonsController', () => {
  let controller: ReasonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [ReasonsController],
      providers: [ReasonsService],
    }).compile();

    controller = module.get<ReasonsController>(ReasonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
