import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Update with your actual Prisma service path
import { CreateReason, Reason } from '@my-workspace/common';

@Injectable()
export class ReasonsService {
  constructor(private prisma: PrismaService) {}

  create(reasonData: CreateReason) {
    return this.prisma.reason.create({
      data: reasonData,
    });
  }

  findAll() {
    return this.prisma.reason.findMany();
  }

  findOne(id: string) {
    return this.prisma.reason.findUnique({ where: { id } });
  }

  update(id: string, reasonData: Partial<Reason>) {
    return this.prisma.reason.update({
      where: { id },
      data: reasonData,
    });
  }

  remove(id: string) {
    return this.prisma.reason.delete({ where: { id } });
  }
}
