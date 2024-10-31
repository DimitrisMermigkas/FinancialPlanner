// app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { BalanceModule } from './balance/balance.module';
import { FundsModule } from './funds/funds.module';
import { TransactionModule } from './transaction/transaction.module';
import { ReasonsModule } from './reasons/reasons.module';

@Module({
  imports: [PrismaModule, BalanceModule, FundsModule, TransactionModule, ReasonsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
