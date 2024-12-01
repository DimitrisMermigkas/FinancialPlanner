import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCurrentBalance } from '@my-workspace/common';
import { CurrentBalanceService } from './currentbalance.service';

@ApiTags('Funds') // Tag for grouping in Swagger
@Controller('funds')
export class CurrentBalanceController {
  constructor(private readonly currentBalanceService: CurrentBalanceService) {}

  @Get()
  findAll() {
    return this.currentBalanceService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCurrentBalance: UpdateCurrentBalance
  ) {
    return this.currentBalanceService.update(id, updateCurrentBalance);
  }
}
