import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscription } from '@my-workspace/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  create(createSubscription: CreateSubscription) {
    return this.prisma.subscription.create({
      data: createSubscription,
    });
  }

  findAll() {
    return this.prisma.subscription.findMany({
      include: {
        card: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.subscription.findUnique({
      where: { id },
      include: {
        card: true,
      },
    });
  }

  update(id: string, updateSubscription: Partial<CreateSubscription>) {
    return this.prisma.subscription.update({
      where: { id },
      data: updateSubscription,
      include: {
        card: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.subscription.delete({ where: { id } });
  }

  toggle(id: string) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const subscription = await tx.subscription.findUnique({ where: { id } });
      return tx.subscription.update({
        where: { id },
        data: { active: !subscription?.active },
      });
    });
  }
}
