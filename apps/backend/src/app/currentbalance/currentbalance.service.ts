import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCurrentBalance } from '@my-workspace/common';

@Injectable()
export class CurrentBalanceService {
  constructor(private prisma: PrismaService) {}

  findAll(filter: Partial<{ [key: string]: any }> = {}) {
    return this.prisma.currentBalance.findMany({
      where: filter, // Use the filter object as dynamic where clause
    });
  }

  update(id: string, updateCurrentBalance: UpdateCurrentBalance) {
    return this.prisma.currentBalance.update({
      where: { id },
      data: updateCurrentBalance,
    });
  }
}
