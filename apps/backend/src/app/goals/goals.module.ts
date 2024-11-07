import { Module } from '@nestjs/common';
import { GoalService } from './goals.service';
import { PrismaService } from '../prisma/prisma.service'; // Import Prisma service
import { GoalController } from './goals.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Add PrismaModule here
  controllers: [GoalController],
  providers: [GoalService, PrismaService],
})
export class GoalModule {}
