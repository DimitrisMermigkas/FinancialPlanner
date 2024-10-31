// balance/balance.module.ts
import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Import PrismaModule

@Module({
  imports: [PrismaModule], // Add PrismaModule here
  providers: [BalanceService],
  controllers: [BalanceController],
})
export class BalanceModule {}
