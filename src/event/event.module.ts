import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [EventController],
  providers: [PrismaService, EventService],
  exports: [EventService],
})
export class EventModule {}
