import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { GoalService } from './goals.service';
import { CreateGoals } from 'libs/common/src';

@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  // Create a new goal
  @Post()
  create(@Body() createGoalDto: CreateGoals) {
    return this.goalService.createGoal(createGoalDto);
  }

  // Get all goals
  @Get()
  findAll() {
    return this.goalService.getGoals();
  }

  // Update goal status
  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateGoalStatusDto: CreateGoals
  ) {
    return this.goalService.updateGoalStatus(id, updateGoalStatusDto.status);
  }

  // Delete a goal
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goalService.deleteGoal(id);
  }
}
