import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [EventController],
  providers: [PrismaService, EventService],
})
export class EventModule {}
