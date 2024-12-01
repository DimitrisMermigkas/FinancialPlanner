// app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { FundsModule } from './funds/funds.module';
import { TransactionModule } from './transaction/transaction.module';
import { ReasonsModule } from './reasons/reasons.module';
import { GoalModule } from './goals/goals.module';
import { HistoryModule } from './history/history.module';
import { CurrentBalanceModule } from './currentbalance/currentbalance.module';

@Module({
  imports: [
    PrismaModule,
    HistoryModule,
    CurrentBalanceModule,
    FundsModule,
    TransactionModule,
    ReasonsModule,
    GoalModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
