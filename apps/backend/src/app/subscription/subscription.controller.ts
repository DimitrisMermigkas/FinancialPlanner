import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateSubscription } from '@my-workspace/common';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  create(@Body() createSubscription: CreateSubscription) {
    return this.subscriptionService.create(createSubscription);
  }

  @Get()
  findAll() {
    return this.subscriptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscription: Partial<CreateSubscription>
  ) {
    return this.subscriptionService.update(id, updateSubscription);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionService.remove(id);
  }

  @Patch(':id/toggle')
  toggle(@Param('id') id: string) {
    return this.subscriptionService.toggle(id);
  }
}
