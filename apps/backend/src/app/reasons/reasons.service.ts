import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Update with your actual Prisma service path
import { CreateReason } from 'libs/common/src';
import { Reason } from '@prisma/client';

@Injectable()
export class ReasonsService {
  constructor(private prisma: PrismaService) {}

  async create(reasonData: CreateReason): Promise<Reason> {
    return this.prisma.reason.create({
      data: reasonData,
    });
  }

  async findAll(): Promise<Reason[]> {
    return this.prisma.reason.findMany();
  }

  findOne(id: string) {
    return this.prisma.reason.findUnique({ where: { id } });
  }

  async update(id: string, reasonData: Partial<Reason>): Promise<Reason> {
    return this.prisma.reason.update({
      where: { id },
      data: reasonData,
    });
  }

  async remove(id: string): Promise<Reason> {
    return this.prisma.reason.delete({
      where: { id },
    });
  }
}
