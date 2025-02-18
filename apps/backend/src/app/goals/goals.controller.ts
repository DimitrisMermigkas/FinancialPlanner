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
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateGoals } from '@my-workspace/common';

@ApiTags('Goals')
@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Goal created successfully.' })
  @ApiResponse({ status: 404, description: 'Reason not found.' })
  @ApiResponse({ status: 400, description: 'Reason already has a goal.' })
  create(@Body() createGoalDto: CreateGoals) {
    return this.goalService.createGoal(createGoalDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns all goals with their reasons.',
  })
  findAll() {
    return this.goalService.getGoals();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Returns the specified goal.' })
  @ApiResponse({ status: 404, description: 'Goal not found.' })
  findOne(@Param('id') id: string) {
    return this.goalService.getGoal(id);
  }

  @Get(':id/progress')
  @ApiResponse({ status: 200, description: 'Returns the goal progress.' })
  @ApiResponse({ status: 404, description: 'Goal not found.' })
  getProgress(@Param('id') id: string) {
    return this.goalService.calculateGoalProgress(id);
  }

  @Put(':id/status')
  @ApiResponse({
    status: 200,
    description: 'Goal status updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Goal not found.' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateGoalStatusDto: CreateGoals
  ) {
    return this.goalService.updateGoalStatus(id, updateGoalStatusDto.status);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Goal deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Goal not found.' })
  remove(@Param('id') id: string) {
    return this.goalService.deleteGoal(id);
  }
}
