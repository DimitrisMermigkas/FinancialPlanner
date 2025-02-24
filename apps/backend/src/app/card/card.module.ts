import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CardController } from './card.controller';
import { CardService } from './card.service';

@Module({
  imports: [PrismaModule], // Add PrismaModule here
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
