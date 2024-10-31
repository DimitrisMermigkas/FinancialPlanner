import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ReasonsService } from './reasons.service';
import { CreateReason, Reason } from 'libs/common/src';

@Controller('reasons')
export class ReasonsController {
  constructor(private readonly reasonsService: ReasonsService) {}

  @Post()
  create(@Body() createReason: CreateReason) {
    return this.reasonsService.create(createReason);
  }

  @Get()
  findAll() {
    return this.reasonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reasonsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReasonDto: Omit<Partial<Reason>, 'id'>
  ) {
    return this.reasonsService.update(id, updateReasonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reasonsService.remove(id);
  }
}
