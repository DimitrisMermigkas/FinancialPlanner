import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Add PrismaModule here
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
