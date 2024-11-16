import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FundsService } from './funds.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateFunds } from '@my-workspace/common';

@ApiTags('Funds') // Tag for grouping in Swagger
@Controller('funds')
export class FundsController {
  constructor(private readonly fundsService: FundsService) {}

  @Post()
  create(@Body() createFundDto: CreateFunds) {
    return this.fundsService.create(createFundDto);
  }

  @Get()
  findAll(@Query() query: { [key: string]: string }) {
    // Parse query parameters to their appropriate types
    const filter: { [key: string]: any } = {};

    for (const [key, value] of Object.entries(query)) {
      // Convert numeric values (e.g., reasonId) if needed
      filter[key] = isNaN(Number(value)) ? value : Number(value);
    }

    return this.fundsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fundsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFundDto: Omit<Partial<CreateFunds>, 'id'>
  ) {
    return this.fundsService.update(id, updateFundDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fundsService.remove(id);
  }
}
