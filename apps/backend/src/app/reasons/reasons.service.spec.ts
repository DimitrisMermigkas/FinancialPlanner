import { Test, TestingModule } from '@nestjs/testing';
import { ReasonsService } from './reasons.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('ReasonsService', () => {
  let service: ReasonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ReasonsService],
    }).compile();

    service = module.get<ReasonsService>(ReasonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
