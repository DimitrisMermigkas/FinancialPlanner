import { Test, TestingModule } from '@nestjs/testing';
import { ReasonsService } from './reasons.service';
import { PrismaService } from '../prisma/prisma.service';
import { Reason } from '@my-workspace/common';

describe('ReasonsService', () => {
  let service: ReasonsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    reason: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReasonsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ReasonsService>(ReasonsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
