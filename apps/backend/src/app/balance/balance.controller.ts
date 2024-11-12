import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BalanceService } from './balance.service';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateBalance } from 'libs/common/src/index';
@ApiTags('Balance') // Tag for grouping in Swagger
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  getCurrentBalance() {
    return this.balanceService.getCurrentBalance(); // Fetch the last balance record
  }

  @Get('all')
  getBalanceHistory() {
    return this.balanceService.getBalanceHistory();
  }
  @Post()
  async createBalance(@Body() createBalance: CreateBalance) {
    try {
      return await this.balanceService.createBalance(createBalance);
    } catch (error) {
      console.error('Error creating balance:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
