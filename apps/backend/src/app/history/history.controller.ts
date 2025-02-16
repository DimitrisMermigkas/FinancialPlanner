import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { CreateHistory } from '@my-workspace/common';
@ApiTags('History') // Tag for grouping in Swagger
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  findAll() {
    return this.historyService.findAll();
  }
  @Post()
  async createHistory(@Body() createHistory: CreateHistory) {
    try {
      return await this.historyService.createHistory(createHistory);
    } catch (error) {
      console.error('Error creating history:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historyService.remove(id);
  }
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateHistory: CreateHistory) {
    return this.historyService.update(id, updateHistory);
  }
}
