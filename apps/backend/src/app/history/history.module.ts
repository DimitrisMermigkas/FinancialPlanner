import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Import PrismaModule
import { HistoryService } from './history.service';

@Module({
  imports: [PrismaModule], // Add PrismaModule here
  providers: [HistoryService],
  controllers: [HistoryController],
})
export class HistoryModule {}
