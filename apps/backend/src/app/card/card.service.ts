import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCard } from '@my-workspace/common';

@Injectable()
export class CardService {
  constructor(private prisma: PrismaService) {}

  create(createCard: CreateCard) {
    return this.prisma.card.create({
      data: createCard,
    });
  }

  findAll() {
    return this.prisma.card.findMany();
  }

  findOne(id: string) {
    return this.prisma.card.findUnique({ where: { id } });
  }

  update(id: string, updateCard: Partial<CreateCard>) {
    return this.prisma.card.update({
      where: { id },
      data: updateCard,
    });
  }

  remove(id: string) {
    return this.prisma.card.delete({ where: { id } });
  }
} 