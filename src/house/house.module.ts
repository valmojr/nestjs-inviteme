import { Module } from '@nestjs/common';
import { HouseService } from './house.service';
import { HouseController } from './house.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [HouseController],
  providers: [PrismaService, HouseService],
})
export class HouseModule {}
