import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Prisma service to interact with database
import { CreateGoals, Goals } from '@my-workspace/common';

@Injectable()
export class GoalService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new goal
  async createGoal(createGoalDto: CreateGoals): Promise<Goals> {
    const { description, amount, status, type } = createGoalDto;
    return this.prisma.goal.create({
      data: {
        description,
        type,
        amount,
        status,
      },
    });
  }

  // Get all goals
  async getGoals(): Promise<Goals[]> {
    return this.prisma.goal.findMany();
  }

  // Update goal status
  async updateGoalStatus(
    id: string,
    status: 'PENDING' | 'IN_PROGRESS' | 'ACHIEVED' | 'FAILED'
  ): Promise<Goals> {
    return this.prisma.goal.update({
      where: { id },
      data: { status },
    });
  }

  // Delete a goal
  async deleteGoal(id: string): Promise<void> {
    await this.prisma.goal.delete({
      where: { id },
    });
  }
}
