import { Module } from '@nestjs/common';
import { FundsService } from './funds.service';
import { FundsController } from './funds.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Add PrismaModule here
  controllers: [FundsController],
  providers: [FundsService],
})
export class FundsModule {}
