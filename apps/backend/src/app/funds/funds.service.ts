import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFunds } from '@my-workspace/common';

@Injectable()
export class FundsService {
  constructor(private prisma: PrismaService) {}

  create(createFunds: CreateFunds) {
    return this.prisma.funds.create({
      data: createFunds,
    });
  }

  findAll(filter: Partial<{ [key: string]: any }> = {}) {
    return this.prisma.funds.findMany({
      where: filter, // Use the filter object as dynamic where clause
    });
  }

  findOne(id: string) {
    return this.prisma.funds.findUnique({ where: { id } });
  }

  update(id: string, updateFunds: Omit<Partial<CreateFunds>, 'id'>) {
    return this.prisma.funds.update({
      where: { id },
      data: updateFunds,
    });
  }

  remove(id: string) {
    return this.prisma.funds.delete({ where: { id } });
  }
}
