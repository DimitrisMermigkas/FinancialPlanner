import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { CreateHistory } from '@my-workspace/common';
@ApiTags('Balance') // Tag for grouping in Swagger
@Controller('balance')
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
}
