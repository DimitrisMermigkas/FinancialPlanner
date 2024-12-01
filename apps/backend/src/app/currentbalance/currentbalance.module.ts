import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CurrentBalanceController } from './currentbalance.controller';
import { CurrentBalanceService } from './currentbalance.service';

@Module({
  imports: [PrismaModule], // Add PrismaModule here
  controllers: [CurrentBalanceController],
  providers: [CurrentBalanceService],
})
export class CurrentBalanceModule {}
