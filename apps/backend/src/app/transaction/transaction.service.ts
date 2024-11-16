import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransaction } from '@my-workspace/common';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async create(createTransaction: CreateTransaction) {
    const { type, amount, description, fundsId, completedAt } =
      createTransaction;
    const transaction = await this.prisma.transaction.create({
      data: { type, amount, description, fundsId, completedAt },
    });

    return transaction;
  }

  findAll() {
    return this.prisma.transaction.findMany({
      orderBy: { completedAt: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.transaction.findUnique({ where: { id } });
  }

  update(
    id: string,
    updateTransactionDto: Omit<Partial<CreateTransaction>, 'id'>
  ) {
    return this.prisma.transaction.update({
      where: { id },
      data: updateTransactionDto,
    });
  }

  remove(id: string) {
    return this.prisma.transaction.delete({ where: { id } });
  }
}
