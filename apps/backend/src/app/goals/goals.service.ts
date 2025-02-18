import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Prisma service to interact with database
import { CreateGoals, Goals } from '@my-workspace/common';

@Injectable()
export class GoalService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new goal
  async createGoal(createGoalDto: CreateGoals): Promise<Goals> {
    const { description, amount, status, type, reasonId, dueDate } =
      createGoalDto;

    // Check if reason exists
    const reason = await this.prisma.reason.findUnique({
      where: { id: reasonId },
      include: { goal: true },
    });

    if (!reason) {
      throw new NotFoundException(`Reason with ID ${reasonId} not found`);
    }

    // Check if reason already has a goal
    if (reason.goal) {
      throw new Error(`Reason ${reason.title} already has a goal`);
    }

    return this.prisma.goal.create({
      data: {
        description,
        type,
        amount,
        status,
        reasonId,
        dueDate,
      },
      include: {
        reason: true, // Include reason details in response
      },
    });
  }

  // Get all goals with their associated reasons
  async getGoals(): Promise<Goals[]> {
    return this.prisma.goal.findMany({
      include: {
        reason: {
          include: {
            funds: true, // Include funds to calculate progress
          },
        },
      },
    });
  }

  // Get a specific goal with its reason and progress
  async getGoal(id: string): Promise<Goals> {
    const goal = await this.prisma.goal.findUnique({
      where: { id },
      include: {
        reason: {
          include: {
            funds: true,
          },
        },
      },
    });

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    return goal;
  }

  // Update goal status
  async updateGoalStatus(
    id: string,
    status: 'PENDING' | 'IN_PROGRESS' | 'ACHIEVED' | 'FAILED'
  ): Promise<Goals> {
    const goal = await this.prisma.goal.findUnique({
      where: { id },
    });

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    return this.prisma.goal.update({
      where: { id },
      data: { status },
      include: {
        reason: true,
      },
    });
  }

  // Delete a goal
  async deleteGoal(id: string): Promise<void> {
    const goal = await this.prisma.goal.findUnique({
      where: { id },
    });

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    await this.prisma.goal.delete({
      where: { id },
    });
  }

  // Calculate goal progress
  async calculateGoalProgress(id: string): Promise<{
    currentAmount: number;
    targetAmount: number;
    percentage: number;
    status: string;
  }> {
    const goal = await this.prisma.goal.findUnique({
      where: { id },
      include: {
        reason: {
          include: {
            funds: true,
          },
        },
      },
    });

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    const currentAmount = goal.reason.funds.reduce(
      (sum, fund) => sum + fund.amount,
      0
    );
    const percentage = (currentAmount / goal.amount) * 100;

    let status = goal.status;
    if (percentage >= 100 && status !== 'ACHIEVED') {
      status = 'ACHIEVED';
      await this.updateGoalStatus(id, 'ACHIEVED');
    } else if (percentage > 0 && status === 'PENDING') {
      status = 'IN_PROGRESS';
      await this.updateGoalStatus(id, 'IN_PROGRESS');
    }

    return {
      currentAmount,
      targetAmount: goal.amount,
      percentage,
      status,
    };
  }
}
