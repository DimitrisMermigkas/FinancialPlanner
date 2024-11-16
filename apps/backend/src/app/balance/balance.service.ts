import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBalance } from '@my-workspace/common';

@Injectable()
export class BalanceService {
  constructor(private prisma: PrismaService) {}

  // Get the most recent balance entry
  async getCurrentBalance() {
    return this.prisma.balance.findFirst({
      orderBy: {
        updatedAt: 'desc', // Adjust based on how you want to define "most recent"
      },
    });
  }
  // Get the most recent balance entry
  async getBalanceHistory() {
    return this.prisma.balance.findMany(); // Fetch all balance records
  }

  async createBalance(createBalance: CreateBalance) {
    try {
      return await this.prisma.balance.create({
        data: createBalance,
      });
    } catch (error) {
      console.error('Error in creating balance:', error);
      throw new Error('Could not create balance');
    }
  }
}
