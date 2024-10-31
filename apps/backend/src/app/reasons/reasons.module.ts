import { Module } from '@nestjs/common';
import { ReasonsService } from './reasons.service';
import { ReasonsController } from './reasons.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Add PrismaModule here
  controllers: [ReasonsController],
  providers: [ReasonsService],
})
export class ReasonsModule {}
