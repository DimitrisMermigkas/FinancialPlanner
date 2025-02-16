import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHistory } from '@my-workspace/common';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  // Get the most recent history entry
  async findAll() {
    return this.prisma.history.findMany(); // Fetch all history records
  }

  async createHistory(createHistory: CreateHistory) {
    try {
      return await this.prisma.history.create({
        data: createHistory,
      });
    } catch (error) {
      console.error('Error in creating history:', error);
      throw new Error('Could not create history');
    }
  }

  remove(id: string) {
    return this.prisma.history.delete({ where: { id } });
  }

  async update(id: string, updateHistory: CreateHistory) {
    try {
      return await this.prisma.history.update({
        where: { id },
        data: updateHistory,
      });
    } catch (error) {
      console.error('Error updating history:', error);
      throw new Error('Could not update history');
    }
  }
}
